import re
import sys
import uuid
import time
import logging
import os
import json
from typing import List, Optional, Dict
from datetime import datetime
from selenium import webdriver
from pipeline.writer import GovPageFile
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from ...types.types import Links, BlogPost

# Initialize global variables
govPageLinks: Dict[str, dict] = Links()  # Ensure this is initialized properly
govPageLinks["businesses"] = {}

class Spider:
    Name = "govpage-private-sector"

    def __init__(self):
        self.AllowedDomains = [
            "https://www.govpage.co.za/",
            "https://www.govpage.co.za/latest-govpage-updates"
        ]
        # WebDriver options
        opt = webdriver.FirefoxOptions()
        opt.add_argument("--headless")  # Enable headless for production
        self.driver = webdriver.Firefox(options=opt)
        self.driver.set_window_size(768, 1024)

        # Initialize scraper state
        self.state_file = 'state.json'
        govPageLinks["businesses"] = {}
        self.current_business_index = 0

    def save_progress(self):
        """Save the current state of the scraper to a file."""
        state = {
            'govPageLinks': govPageLinks,
            'current_business_index': self.current_business_index
        }
        with open(self.state_file, 'w') as f:
            json.dump(state, f)

    def save_data(self):
        """Save the current state data."""
        GovPageFile(govPageLinks, "govpage-private-sector")

    def launch(self):
        """Launch the scraper."""
        log.info(f"{self.Name} spider has launched")

        self.driver.get(self.AllowedDomains[0])
        log.info(f"{self.Name} Home page loading...")

        menu: WebElement = self.driver.find_element(By.CSS_SELECTOR, "*[aria-label='Menu']")
        menu.click()

        menuOptions: List[WebElement] = self.driver.find_elements(By.CSS_SELECTOR, "ul li.wsite-menu-item-wrap a.wsite-menu-item")
        url: Optional[str] = self.AllowedDomains[1]

        for o in menuOptions:
            if "govpage" in o.text.lower():
                url = o.get_attribute("href")
                break

        log.info(f"{self.Name} Home page loaded...")

        if url is not None:
            self.driver.get(url)
            log.info(f" {self.Name} Loading vacancy updates page...")

            wait: WebDriverWait = WebDriverWait(self.driver, 10)
            selector: str = ".blog-title-link"

            elems: List[WebElement] = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, selector)))

            self.driver.execute_script("""
                const elem = document.querySelector('.blog-title-link');
                elem.scrollIntoView({behavior: 'smooth'})
            """)

            elems: List[WebElement] = self.driver.find_elements(By.CSS_SELECTOR, selector)

            vacanciesLink: Optional[str] = None

            for e in elems:
                text: str = e.text.lower()
                fullDate = self.Date().lower()
                dayMonth = fullDate[:10]
                weekday = self.Weekday()

                pattern = rf"{fullDate}|{dayMonth}|{weekday}"
                yes: bool = re.search(pattern, text, re.IGNORECASE)

                if yes:
                    govPageLinks["title"] = self.Name
                    vacanciesLink = e.get_attribute("href")
                    break

            if vacanciesLink is not None:
                self.privateSector(vacanciesLink)
            else:
                self.close()

    def privateSector(self, url: str):
        """Scrape the private sector vacancies."""
        self.driver.get(url)
        log.info(f" {self.Name} vacancy updates page loaded...")

        self.Emma(10)

        self.driver.execute_script("""
            const elem = document.querySelector("[id^='blog-post-'] a");
            elem.scrollIntoView({behavior: 'smooth'})
        """)

        selector: str = "[id^='blog-post-'] a"
        elems: List[WebElement] = self.driver.find_elements(By.CSS_SELECTOR, selector)

        log.info(f"{self.Name} scraping vacancy updates page links...")

        if len(elems) > 0:
            privateSectorURL: Optional[str] = None
            for e in elems:
                text: str = e.text.lower().lstrip()
                href: str = e.get_attribute("href")

                pattern = r"private sector vacancies|private property opportunities|private sector opportunities|public sector opportunities"
                a = len(text) > 0
                b: bool = re.search(pattern, text, re.IGNORECASE)

                if a and b:
                    privateSectorURL = href

            if privateSectorURL is None:
                self.close()

            self.driver.get(privateSectorURL)
            self.driver.execute_script("""
                const elem = document.querySelector("[id^='blog-post-'] a");
                elem.scrollIntoView({behavior: 'smooth'})
            """)

            self.Emma(10)
            pvtElems: List[WebElement] = self.driver.find_elements(By.CSS_SELECTOR, selector)

            if len(pvtElems) > 0:
                for e in pvtElems:
                    text: str = e.text.lower().lstrip()
                    href: str = e.get_attribute("href")

                    if text is not None and len(text) > 0:
                        readMore: bool = re.search(r"read more", text, re.IGNORECASE)
                        if not readMore and "https://www.govpage.co.za" in href:
                            govPageLinks["businesses"][text] = href

                numOfBusinesses = len(govPageLinks["businesses"].keys())

                log.info(f"{self.Name} found {numOfBusinesses} vacancy updates page links..")
                log.info(f"{self.Name}, scrapping vacancy updates page links content...")

                while self.current_business_index < len(govPageLinks["businesses"]):
                    k = list(govPageLinks["businesses"].keys())[self.current_business_index]
                    log.info(f'{self.current_business_index + 1}, scrapping {k} data')
                    blogpost = self.postContent(govPageLinks["businesses"][k])
                    govPageLinks["blogPosts"].append(blogpost)

                    self.save_data()
                    self.current_business_index += 1
                    self.save_progress()

            self.driver.close()
            log.info(f"{self.Name} done")

    def postContent(self, url: str):
        """Extract content from a blog post."""
        self.driver.get(url)

        WebDriverWait(self.driver, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".blog-post")))

        self.driver.execute_script("""
            const elem = document.querySelector('.blog-post');
            elem.scrollIntoView({behavior: 'smooth'})
        """)

        selector: str = ".blog-title-link.blog-link"
        elems: List[WebElement] = self.driver.find_elements(By.CSS_SELECTOR, selector)
        if len(elems) > 0:
            e = elems[0]
            text = e.text
            href = e.get_attribute("href")

            date = self.driver.find_element(By.CSS_SELECTOR, ".blog-date > .date-text")
            date = date.text

            blogPost = BlogPost()

            blogPost["imgSrc"] = self.driver.execute_script("""
                    return location.origin + document.querySelector("*[alt='Picture']").getAttribute("src")
            """)
            blogPost["title"] = text
            blogPost["href"] = href
            blogPost["postedDate"] = date
            blogPost["uuid"] = "gov-" + str(uuid.uuid4())

            return blogPost

    def Emma(self, t: int):
        """Delay function."""
        time.sleep(t)

    def Date(self) -> str:
        """Get today's date in YYYY-MM-DD format."""
        return str(datetime.today().strftime('%Y-%m-%d'))

    def Weekday(self) -> str:
        """Get the current weekday."""
        return str(datetime.today().strftime('%A'))

    def close(self):
        """Close the browser."""
        self.driver.close()

# Create a custom formatter for log messages
log_formatter = logging.Formatter("%(asctime)s [%(levelname)s]: %(message)s", datefmt="%d %B %Y %H:%M:%S")
log = logging.getLogger()
log.setLevel(logging.INFO)  # Set the logging level to INFO
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(log_formatter)
log.addHandler(console_handler)
