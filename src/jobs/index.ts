// src/jobs/index.ts
import cron from "node-cron";
import { logger } from "../utils/logger";
import { sendWeeklyInstructorReminders } from "./email-scheduler";
// Import other job functions as needed

/**
 * Initialize all cron jobs for the application
 */
export const initCronJobs = (): void => {
  logger.info("Initializing cron jobs...");

  // Schedule weekly instructor reminder emails - runs every Monday at 9:00 AM
  cron.schedule("1 * * * *", async () => {
    try {
      logger.info("Running weekly instructor reminder job");
      await sendWeeklyInstructorReminders();
      logger.info("Weekly instructor reminder job completed successfully");
    } catch (error) {
      logger.error("Weekly instructor reminder job failed:", error);
    }
  });

  // Add more cron jobs as needed

  logger.info("All cron jobs initialized successfully");
};

/**
 * Run a specific job immediately (useful for testing)
 * @param jobName - Name of the job to run
 */
export const runJobManually = async (jobName: string): Promise<void> => {
  logger.info(`Manually running job: ${jobName}`);

  switch (jobName) {
    case "weeklyInstructorReminders":
      await sendWeeklyInstructorReminders();
      break;
    // Add other jobs as needed
    default:
      throw new Error(`Unknown job name: ${jobName}`);
  }

  logger.info(`Manual job execution completed: ${jobName}`);
};
