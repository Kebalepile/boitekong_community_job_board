import sys
import os
import re
import uuid
import time
import logging
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import MoveTargetOutOfBoundsException

# Assuming Links and BlogPost classes are defined somewhere else in your project
from spiders.types.types import Links, BlogPost
from pipeline.writer import GovPageFile  # Adjust the import statement


class Spider:
    Name = "govpage-public-sector"
    progress_file = 'progress.json'

    def __init__(self):
        self.AllowedDomains = [
            "https://www.govpage.co.za/",
            "https://www.govpage.co.za/latest-govpage-updates"
        ]
        opt = webdriver.FirefoxOptions()
        opt.add_argument("--headless")
        self.driver = webdriver.Firefox(options=opt)
        self.driver.set_window_size(768, 1024)
        self.govPageLinks = Links()
        self.load_progress()

    def load_progress(self):
        if os.path.exists(self.progress_file):
            with open(self.progress_file, 'r') as f:
                self.progress = json.load(f)
        else:
            self.progress = {"departments_scraped": 0}

    def save_progress(self):
        with open(self.progress_file, 'w') as f:
            json.dump(self.progress, f)

    def save_data(self):
        GovPageFile(self.govPageLinks, "govpage-public-sector")

    
    def launch(self):
        log.info(f"{self.Name} spider has Launched")
        self.driver.get(self.AllowedDomains[0])
        log.info(f"{self.Name} Home page loading...")

        try:
            menu = self.driver.find_element(By.CSS_SELECTOR, "*[aria-label='Menu']")
            try:
                menu.click()  # Try clicking the menu
            except Exception as click_error:
                # Log the error but continue
                log.warning(f"Could not click element with attribute '*[aria-label=\"Menu\"]'")

            # Proceed with menu options and other logic even if click fails
            menu_options = self.driver.find_elements(By.CSS_SELECTOR, "ul li.wsite-menu-item-wrap a.wsite-menu-item")

            url = self.AllowedDomains[1]
            for option in menu_options:
                if "govpage" in option.text.lower():
                    url = option.get_attribute("href")
                    break

            log.info(f"{self.Name} Home page loaded...")
            if url:
                self.driver.get(url)
                log.info(f"{self.Name} Loading vacancy updates page...")
                wait = WebDriverWait(self.driver, 10)
                selector = ".blog-title-link"
                elems = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, selector)))

                # Attempt to scroll to the element
                try:
                    elem_to_scroll = self.driver.find_element(By.CSS_SELECTOR, ".blog-title-link")
                    actions = ActionChains(self.driver)
                    actions.move_to_element(elem_to_scroll).perform()  # Scroll the page to the element
                except MoveTargetOutOfBoundsException as e:
                    log.warning(f"Could not scroll to element with class '.blog-title-link'")  # Log the scroll failure

                # Proceed with the rest of the logic even if scrolling fails
                elems = self.driver.find_elements(By.CSS_SELECTOR, selector)

                vacancies_link = None
                for elem in elems:
                    text = elem.text.lower()
                    full_date = self.get_date().lower()
                    day_month = full_date[:10]
                    weekday = self.get_weekday()

                    pattern = rf"{full_date}|{day_month}|{weekday}"
                    if re.search(pattern, text, re.IGNORECASE):
                        self.govPageLinks["title"] = self.Name
                        vacancies_link = elem.get_attribute("href")
                        break

                if vacancies_link:
                    self.scrape_departments(vacancies_link)
                else:
                    self.close()

        except Exception as e:
            log.error(f"Error during launch: {str(e)}")
            self.close()



    def scrape_departments(self, url: str):
        self.driver.get(url)
        log.info(f"{self.Name} vacancy updates page loaded...")
        self.dynamic_wait(10)

        try:
            self.driver.execute_script("document.querySelector('[id^=\"blog-post-\"] a').scrollIntoView({behavior: 'smooth'})")

            selector = "[id^='blog-post-'] a"
            elems = self.driver.find_elements(By.CSS_SELECTOR, selector)

            log.info(f"{self.Name} scraping vacancy updates page links...")
            if len(elems) > 0:
                for elem in elems:
                    text = elem.text.lower().lstrip()
                    href = elem.get_attribute("href")

                    if text and not re.search(rf"{self.get_date().lower()}|{self.get_date()[:10].lower()}|{self.get_weekday()}", text, re.IGNORECASE) and \
                       not re.search(r"private property opportunities|private sector opportunities|public sector opportunities", text, re.IGNORECASE):
                        if "https://www.govpage.co.za" in href:
                            self.govPageLinks["departments"][text] = href

                num_of_departments = len(self.govPageLinks["departments"].keys())
                log.info(f"{self.Name} found {num_of_departments} vacancy updates page links.")
                log.info(f"{self.Name} scraping vacancy updates page links content...")

                for i, k in enumerate(self.govPageLinks["departments"]):

                    url = self.govPageLinks["departments"][k]
                    log.info(f"{i + 1}, scraping {k} data")
                    blogpost = self.scrape_post_content(url)
                    self.govPageLinks["blogPosts"].append(blogpost)
                    self.progress["departments_scraped"] = i + 1
                    self.save_data()
                    self.save_progress()
                    

            self.driver.close()
            log.info(f"{self.Name} done")

        except Exception as e:
            log.error(f"Error during department scraping: {str(e)}")
            self.close()

    def scrape_post_content(self, url: str):
        self.driver.get(url)
        WebDriverWait(self.driver, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".blog-post")))
        self.driver.execute_script("document.querySelector('.blog-post').scrollIntoView({behavior: 'smooth'})")

        selector = ".blog-title-link.blog-link"
        elems = self.driver.find_elements(By.CSS_SELECTOR, selector)
        if elems:
            elem = elems[0]
            text = elem.text
            href = elem.get_attribute("href")

            date = self.driver.find_element(By.CSS_SELECTOR, ".blog-date > .date-text").text

            blog_post = BlogPost()
            blog_post["imgSrc"] = self.driver.execute_script("return location.origin + document.querySelector('*[alt=\"Picture\"]').getAttribute('src')")
            blog_post["title"] = text
            blog_post["href"] = href
            blog_post["postedDate"] = date
            blog_post["uuid"] = "p" + str(uuid.uuid4())
            blog_post["content"] = []

            paragraphs = self.driver.find_elements(By.CSS_SELECTOR, ".blog-content > .paragraph")
            for paragraph in paragraphs:
                blog_post["content"].append(paragraph.text)

            if not blog_post["content"]:
                src = self.driver.execute_script("""
                    return Array.from(document.getElementsByTagName('iframe'))
                                .filter(f => f.src.includes('drive.google'))
                                .map(f => f.src)[0];
                """)
                blog_post["iframe"] = src

            return blog_post
        return "no blog post found"

    def close(self):
        log.warning(f"{self.Name}, Sorry, No Government Job Posts for today")
        self.driver.close()

    @staticmethod
    def get_weekday() -> str:
        return datetime.now().strftime("%A").lower()

    @staticmethod
    def get_date() -> str:
        return datetime.now().strftime("%d %B %Y")

    @staticmethod
    def dynamic_wait(seconds: float):
        time.sleep(seconds)


# Create a custom formatter for log messages
log_formatter = logging.Formatter("%(asctime)s [%(levelname)s]: %(message)s", datefmt="%d %B %Y %H:%M:%S")
log = logging.getLogger()
log.setLevel(logging.INFO)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(log_formatter)
log.addHandler(console_handler)
