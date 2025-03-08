# Steam Deck Refurbished Stock Checker

NOTE: `checkStock_v01.js` is the running version. `checkStock.js` can be used when the page is temporarily modified.

## To-Do

Document of features to be added: [TO-DO.md](TO-DO.md)

## Overview

This script checks the stock status of refurbished Steam Decks on the Steam store. It uses Puppeteer to scrape the webpage and Nodemailer to send email alerts when stock availability changes.

## Features

- Automatically checks the Steam Deck refurbished store page.
- Parses stock availability based on a specified CSS class and text.
- Sends an email notification when the stock status changes.
- Runs in a loop with a configurable check interval.

## Prerequisites

- Node.js installed on your system.
- A valid SMTP server for sending emails.

## Installation

1. Clone this repository or copy the script.
2. Navigate to the project folder.
3. Install dependencies using:
   ```sh
   npm install
   ```

## Configuration

Create a `.env` file in the project root with the following environment variables:

```env
SMTP_SERVER=<your_smtp_server>
SMTP_PORT=587
EMAIL_SENDER=<your_email>
EMAIL_PASSWORD=<your_email_password>
```

## Usage

Run the script using:

```sh
node checkStock_v01.js
```

The script will:

1. Open the Steam Deck refurbished store page.
2. Check if the stock status has changed.
3. Send an email if new stock is detected.
4. Repeat the check every 60 minutes (configurable).

## Customization

- Modify the `URL`, `TARGET_TEXT`, and `CLASS_NAME` variables to adapt the script to different products or websites.
- Adjust the `CHECK_INTERVAL` variable to change the frequency of checks.

## Dependencies

- `puppeteer`: For web scraping.
- `nodemailer`: For sending email notifications.
- `dotenv`: For managing environment variables.

## License

This project is licensed under the MIT License.
