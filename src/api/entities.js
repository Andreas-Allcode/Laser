import { db } from './base44Client';

// Database operations for each entity
export const Client = {
  getAll: () => db.getClients(),
  create: (data) => db.createClient(data),
};

export const Portfolio = {
  getAll: () => db.getPortfolios(),
  create: (data) => db.createPortfolio(data),
};

export const Debt = {
  getAll: () => db.getDebts(),
  create: (data) => db.createDebt(data),
};

export const Payment = {
  getAll: () => db.getPayments(),
  create: (data) => db.createPayment(data),
};

// Placeholder entities for future implementation
export const SavedSearch = {};
export const Notification = {};
export const AccountNote = {};
export const PaymentPlan = {};
export const FileUploadTemplate = {};
export const FileUpload = {};
export const Widget = {};
export const MediaFile = {};
export const ScrubJob = {};
export const ActivityLog = {};
export const BuyBack = {};
export const Remittance = {};
export const RemittanceException = {};
export const NotificationConfig = {};
export const LetterTemplate = {};
export const DebtStatus = {};