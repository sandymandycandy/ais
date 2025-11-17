import { Request, Response, NextFunction } from 'express';

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

/**
 * Check if user has admin role (any type of admin)
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const adminRoles = ['college_admin', 'company_admin', 'super_admin'];

  if (!adminRoles.includes(user.role)) {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

/**
 * Check if user is a college admin
 */
export const isCollegeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (user.role !== 'college_admin' && user.role !== 'super_admin') {
    return res.status(403).json({
      message: 'Access denied. College admin privileges required.'
    });
  }

  next();
};

/**
 * Check if user is a company admin
 */
export const isCompanyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (user.role !== 'company_admin' && user.role !== 'super_admin') {
    return res.status(403).json({
      message: 'Access denied. Company admin privileges required.'
    });
  }

  next();
};

/**
 * Check if user is a super admin
 */
export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (user.role !== 'super_admin') {
    return res.status(403).json({
      message: 'Access denied. Super admin privileges required.'
    });
  }

  next();
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (...requiredPermissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Super admin has all permissions
    if (user.role === 'super_admin') {
      return next();
    }

    // Check if user has at least one of the required permissions
    const hasRequiredPermission = requiredPermissions.some(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasRequiredPermission) {
      return res.status(403).json({
        message: 'Access denied. Insufficient permissions.',
        requiredPermissions
      });
    }

    next();
  };
};

/**
 * Check if user has all specified permissions
 */
export const hasAllPermissions = (...requiredPermissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Super admin has all permissions
    if (user.role === 'super_admin') {
      return next();
    }

    // Check if user has all required permissions
    const hasAllRequired = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    );

    if (!hasAllRequired) {
      return res.status(403).json({
        message: 'Access denied. Missing required permissions.',
        requiredPermissions
      });
    }

    next();
  };
};

// Common permission constants
export const PERMISSIONS = {
  // Content Management
  CREATE_NOTE: 'create:note',
  EDIT_NOTE: 'edit:note',
  DELETE_NOTE: 'delete:note',
  APPROVE_NOTE: 'approve:note',

  CREATE_EXAM: 'create:exam',
  EDIT_EXAM: 'edit:exam',
  DELETE_EXAM: 'delete:exam',

  CREATE_OPPORTUNITY: 'create:opportunity',
  EDIT_OPPORTUNITY: 'edit:opportunity',
  DELETE_OPPORTUNITY: 'delete:opportunity',

  CREATE_ANNOUNCEMENT: 'create:announcement',
  EDIT_ANNOUNCEMENT: 'edit:announcement',
  DELETE_ANNOUNCEMENT: 'delete:announcement',

  // User Management
  VIEW_USERS: 'view:users',
  CREATE_USER: 'create:user',
  EDIT_USER: 'edit:user',
  DELETE_USER: 'delete:user',
  BAN_USER: 'ban:user',

  // Analytics
  VIEW_ANALYTICS: 'view:analytics',
  EXPORT_DATA: 'export:data',

  // System
  MANAGE_SETTINGS: 'manage:settings',
  MANAGE_ROLES: 'manage:roles',
  VIEW_LOGS: 'view:logs'
};

// Default permissions by role
export const DEFAULT_PERMISSIONS = {
  college_admin: [
    PERMISSIONS.CREATE_NOTE,
    PERMISSIONS.EDIT_NOTE,
    PERMISSIONS.APPROVE_NOTE,
    PERMISSIONS.CREATE_EXAM,
    PERMISSIONS.EDIT_EXAM,
    PERMISSIONS.DELETE_EXAM,
    PERMISSIONS.CREATE_ANNOUNCEMENT,
    PERMISSIONS.EDIT_ANNOUNCEMENT,
    PERMISSIONS.DELETE_ANNOUNCEMENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  company_admin: [
    PERMISSIONS.CREATE_OPPORTUNITY,
    PERMISSIONS.EDIT_OPPORTUNITY,
    PERMISSIONS.DELETE_OPPORTUNITY,
    PERMISSIONS.CREATE_ANNOUNCEMENT,
    PERMISSIONS.EDIT_ANNOUNCEMENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  super_admin: Object.values(PERMISSIONS)
};
