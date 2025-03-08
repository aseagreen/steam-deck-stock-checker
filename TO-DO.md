## TODO Section for the README

### Mission:

Find a solution to run the Puppeteer scraper once every hour, send an email when stock changes, and store/retrieve data from a database. The task should be executed on a free service.

### Tasks:

1. **Set up Free Hosting Service:**

   - Research and set up a free service (e.g., Heroku, Vercel, GitHub Actions, or any other free hosting solution) to run the Puppeteer scraper every hour.
   - Ensure the service allows running scheduled tasks (e.g., cron jobs or equivalent).
   - Remove the current sleep-loop from the code to prevent it from running continuously and instead rely on the hosting service's scheduling mechanism.

2. **Email Configuration:**

   - Implement functionality to send an email to one or more recipients when the stock changes.
   - Make the email content dynamic to include details such as the model version, stock status, and timestamp of the change.
   - Test the email system to ensure proper delivery on stock change events.

3. **Database Integration:**
   - Set up a free database (e.g., MongoDB Atlas, Firebase, or PostgreSQL on Heroku).
   - Modify the current code to store the current stock status in the database.
   - Modify the code to read from the database and track the previous stock state to compare changes.
4. **Automate Script Execution:**

   - Schedule the Puppeteer script to run once every hour on the selected hosting platform.
   - Ensure the process runs reliably without manual intervention.

5. **Logging & Monitoring:**

   - Set up logging to track when the stock is checked and whether the stock status changes.
   - Ensure there’s a way to monitor the scraper’s execution for any failures or issues.

6. **Error Handling:**

   - Improve error handling to ensure the scraper continues to run smoothly even in case of occasional errors (e.g., database connectivity issues, email failure, or website access issues).
   - Log all errors for debugging.

### Additional Improvements:

- Implement a feature to notify multiple recipients via email.
- Add logging to a file or a cloud-based logging service.
- Implement retries or fallback mechanisms for transient errors.
