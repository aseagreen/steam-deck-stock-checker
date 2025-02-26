require('dotenv').config()
const puppeteer = require('puppeteer')
const nodemailer = require('nodemailer')

// Configuration
const URL = 'https://store.steampowered.com/sale/steamdeckrefurbished/'
const CLASS_NAME = 'W9_WAYXgEe-t-7aqqC4Jp'
const CHECK_INTERVAL = 3600000 // 60 minutes in milliseconds
let previousContent = []

// Email configuration
const EMAIL_RECEIVER = process.env.EMAIL_SENDER

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
    text: `The content of one or more items has changed. Check the website: ${URL}`,
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
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(
      `document.querySelectorAll('div.${CLASS_NAME}').length >= 5`
    )

    // Extract the raw HTML content of the target elements
    const items = await page.$$(`div.${CLASS_NAME}`)
    const currentContent = []

    for (const item of items) {
      const html = await page.evaluate((el) => el.outerHTML, item)
      currentContent.push(html)
    }

    console.log('Previous content:', previousContent)
    console.log('Current content:', currentContent)

    // Check if the content has changed
    if (
      previousContent.length > 0 &&
      JSON.stringify(previousContent) !== JSON.stringify(currentContent)
    ) {
      await sendEmail()
      return true
    }

    previousContent = currentContent

    const currentTime = new Date().toLocaleString()
    console.log(`[${currentTime}] No changes detected.`)
    return false
  } catch (error) {
    console.error('Error checking the website:', error)
    return false
  } finally {
    await browser.close()
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
