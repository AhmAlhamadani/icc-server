import express from 'express';
import cors from 'cors';

// User Authentication routes
import signupRoute from './routes/user/authentication/signup.js';
import loginRoute from './routes/user/authentication/login.js';
import authorizationUser from './middleware/authorizationUser.js';
import isVerifiedRoute from './routes/user/authentication/isVerified.js';
import getUserInfoRoute from './routes/user/authentication/getUserInfo.js';

// Admin Authentication
import authorizationAdmin from './middleware/authorizationAdmin.js';
import isVerifiedAdminRoute from './routes/admin/authentication/isVerified.js';
// Admin User Management routes
import getUsersRoute from './routes/admin/userManagement/getUsers.js';
import getUserRoute from './routes/admin/userManagement/getUser.js';
import deleteUserRoute from './routes/admin/userManagement/deleteUser.js';
import updateRoleRoute from './routes/admin/userManagement/updateRole.js';
import updateTierRoute from './routes/admin/userManagement/updateTier.js';
import updatePointsRoute from './routes/admin/userManagement/updatePoints.js';

const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS

///////////////////////
// User routes setup //
///////////////////////

// Authentication
app.use('/api/user/signup', signupRoute);
app.use('/api/user/login', loginRoute);

// Authenticated user routes
app.use('/api/user/is-verified', authorizationUser, isVerifiedRoute);
app.use('/api/user/get-user-info', authorizationUser, getUserInfoRoute);

///////////////////////
// Admin routes setup//
///////////////////////

// Authentication
app.use('/api/admin/is-verified', authorizationAdmin, isVerifiedAdminRoute);

// User Management
app.use('/api/admin/user-management/get-users', authorizationAdmin, getUsersRoute);
app.use('/api/admin/user-management/get-user', authorizationAdmin, getUserRoute);
app.use('/api/admin/user-management/delete-user', authorizationAdmin, deleteUserRoute);
app.use('/api/admin/user-management/update-role', authorizationAdmin, updateRoleRoute);
app.use('/api/admin/user-management/update-tier', authorizationAdmin, updateTierRoute);
app.use('/api/admin/user-management/update-points', authorizationAdmin, updatePointsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
