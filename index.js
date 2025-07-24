import express from 'express';
import cors from 'cors';

// Authorization middleware
import authorizationUser from './middleware/authorizationUser.js';
import authorizationAdmin from './middleware/authorizationAdmin.js';

// User Authentication routes
import signupRoute from './routes/user/authentication/signup.js';
import loginRoute from './routes/user/authentication/login.js';
import isVerifiedRoute from './routes/user/authentication/isVerified.js';
import getUserInfoRoute from './routes/user/authentication/getUserInfo.js';

// Admin Authentication
import isVerifiedAdminRoute from './routes/admin/authentication/isVerified.js';
// Admin User Management routes
import getUsersRoute from './routes/admin/userManagement/getUsers.js';
import getUserRoute from './routes/admin/userManagement/getUser.js';
import deleteUserRoute from './routes/admin/userManagement/deleteUser.js';
import updateRoleRoute from './routes/admin/userManagement/updateRole.js';
import updateTierRoute from './routes/admin/userManagement/updateTier.js';
import updatePointsRoute from './routes/admin/userManagement/updatePoints.js';
// Admin Category Management routes
import createCategoryRoute from './routes/admin/categories/createCategory.js';
import createSubCategoryRoute from './routes/admin/categories/createSubCategory.js';
import getCategoriesRoute from './routes/admin/categories/getCategories.js';
import getSubCategoriesRoute from './routes/admin/categories/getSubCategories.js';
import deleteCategoryRoute from './routes/admin/categories/deleteCategory.js';
import deleteSubCategoryRoute from './routes/admin/categories/deleteSubCategory.js';
import updateCategoryRoute from './routes/admin/categories/updateCategory.js';
import updateSubCategoryRoute from './routes/admin/categories/updateSubCategory.js';
// Admin Product Management routes
import createProductRoute from './routes/admin/products/createProduct.js';
import getProductsRoute from './routes/admin/products/getProducts.js';
import getProductRoute from './routes/admin/products/getProduct.js';
import deleteProductRoute from './routes/admin/products/deleteProduct.js';
import updateProductRoute from './routes/admin/products/updateProduct.js';
// Admin Order Management routes
import getOrderRoute from './routes/admin/order/getOrder.js';
import getOrdersRoute from './routes/admin/order/getOrders.js';
import deleteOrderRoute from './routes/admin/order/deleteOrder.js';
import updateOrderStatusRoute from './routes/admin/order/updateOrderStatus.js';
// Admin Points-History Management routes
import getPointsHistoryRoute from './routes/admin/pointsHistory/getPointHistory.js';
import getPointsHistoryByUserRoute from './routes/admin/pointsHistory/getUserPointsHistory.js';



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

// Category Management
app.use('/api/admin/categories/create-category', authorizationAdmin, createCategoryRoute);
app.use('/api/admin/categories/create-sub-category', authorizationAdmin, createSubCategoryRoute);
app.use('/api/admin/categories/get-categories', authorizationAdmin, getCategoriesRoute);
app.use('/api/admin/categories/get-sub-categories', authorizationAdmin, getSubCategoriesRoute);
app.use('/api/admin/categories/delete-category', authorizationAdmin, deleteCategoryRoute);
app.use('/api/admin/categories/delete-sub-category', authorizationAdmin, deleteSubCategoryRoute);
app.use('/api/admin/categories/update-category', authorizationAdmin, updateCategoryRoute);
app.use('/api/admin/categories/update-sub-category', authorizationAdmin, updateSubCategoryRoute);

// Product Management
app.use('/api/admin/products/create-product', authorizationAdmin, createProductRoute);
app.use('/api/admin/products/get-products', authorizationAdmin, getProductsRoute);
app.use('/api/admin/products/get-product', authorizationAdmin, getProductRoute);
app.use('/api/admin/products/delete-product', authorizationAdmin, deleteProductRoute);
app.use('/api/admin/products/update-product', authorizationAdmin, updateProductRoute);

// Order Management
app.use('/api/admin/orders/get-order', authorizationAdmin, getOrderRoute);
app.use('/api/admin/orders/delete-order', authorizationAdmin, deleteOrderRoute);
app.use('/api/admin/orders/update-order-status', authorizationAdmin, updateOrderStatusRoute);
app.use('/api/admin/orders/get-orders', authorizationAdmin, getOrdersRoute);

// Points History Management
app.use('/api/admin/points-history/get-points-history', authorizationAdmin, getPointsHistoryRoute);
app.use('/api/admin/points-history/get-points-history-by-user', authorizationAdmin, getPointsHistoryByUserRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
