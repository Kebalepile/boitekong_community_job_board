from spiders.public.govpage.govpageSpider import Spider as PublicSpider
from spiders.private.govpage.govpageSpider import Spider as PrivateSpider
from bots.entities.national.national_credit_regulator.Bot import Bot as NCR_Bot
from  bots.entities.national.community_schemes_ombud_services.Bot import Bot as CSOS_Bot
from bots.entities.national.postbank.Bot import Bot as Postbank_Bot
# from bots.entities.national.rainbow.Bot import Bot as Rainbow_Bot
import time
import logging


from utils.rename_imgs_and_generate_json import rename_images_and_create_json
from utils.rename_pdfs_and_generate_json import rename_pdfs_and_create_json
from utils.pdf_to_image import create_images_from_pdf_pages

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s]: %(message)s', datefmt='%d %B %Y %H:%M:%S')

    try:
        logging.info("Starting Public Spider")
        govpage_spider = PublicSpider()
        govpage_spider.launch()


        # logging.info("Pausing for 10 seconds")
        # time.sleep(10)  # pause for 10s

        # logging.info("Starting Private Spider")
        # govpage_private_spider = PrivateSpider()
        # govpage_private_spider.launch()

        # logging.info("Starting Bots")
        # nrc_bot = NCR_Bot()
        # nrc_bot.run()

        # logging.info("Starting CSOS Bot")
        # csos_bot = CSOS_Bot()
        # csos_bot.run()

        # postbank_bot = Postbank_Bot()
        # postbank_bot.run()

        # rainbow_bot = Rainbow_Bot()
        # rainbow_bot.run()

        rename_images_and_create_json()
        # rename_pdfs_and_create_json()
        # create_images_from_pdf_pages()
    except Exception as e:
        logging.error(f"An error occurred while initiating bots: {e}")

if __name__ == "__main__":
    main()
