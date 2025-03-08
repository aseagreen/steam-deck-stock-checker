require('dotenv').config()
const puppeteer = require('puppeteer')
const nodemailer = require('nodemailer')

// Configuration
const URL = 'https://store.steampowered.com/sale/steamdeckrefurbished/'
const TARGET_TEXT = 'Out of stock'
const CLASS_NAME = 'CartBtn'
const CHECK_INTERVAL = 3600000 // 60 minute in milliseconds
let itemsInStock

// Email configuration
const EMAIL_RECEIVER = process.env.EMAIL_SENDER // Sends email to sender

// Function to send email
async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT, // 587
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: `"Steam Deck Stock Alert" <${process.env.EMAIL_SENDER}>`,
    to: EMAIL_RECEIVER,
    subject: 'Steam Deck Refurbished Status Change',
    text: `The status of one or more items has changed from "${TARGET_TEXT}". Check the website: ${URL}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully.')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

// Function to check stock status using Puppeteer
async function checkStockStatus() {
  const browser = await puppeteer.launch({ headless: true }) // Launch browser
  const page = await browser.newPage() // Open a new page

  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded' }) // Wait for the DOM to be loaded
    await page.waitForFunction(
      `document.querySelectorAll('div.${CLASS_NAME} span').length >= 5`
    ) // Wait for the elements to appear

    let statusChanged = false
    let currentItemsInStock = 0

    // Extract the text content of the target elements
    const items = await page.$$(`div.${CLASS_NAME} span`)
    for (const item of items) {
      const spanText = await page.evaluate((el) => el.textContent.trim(), item)
      console.log(spanText)

      if (spanText !== TARGET_TEXT) {
        currentItemsInStock++
      }
    }

    if (itemsInStock && itemsInStock !== currentItemsInStock) {
      statusChanged = true
    }

    console.log('Items in stock: ', itemsInStock)
    console.log('Current items in stock: ', currentItemsInStock)

    itemsInStock = currentItemsInStock

    if (statusChanged) {
      await sendEmail()
      return true
    } else {
      const currentTime = new Date().toLocaleString()
      console.log(`[${currentTime}] All items are still out of stock.`)
      return false
    }
  } catch (error) {
    console.error('Error checking the website:', error)
    return false
  } finally {
    await browser.close() // Close the browser
  }
}

// Main loop to check the stock status at regular intervals
;(async function main() {
  console.log('Starting stock checker...')
  while (true) {
    const statusChanged = await checkStockStatus()
    if (statusChanged) break // Stop script if an email is sent
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL))
  }
})()
