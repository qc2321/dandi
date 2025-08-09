import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

// Generate a JWT token for API authentication
export function generateApiToken(user) {
    return jwt.sign(
        {
            email: user.email,
            name: user.name,
            sub: user.id || user.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        },
        JWT_SECRET
    );
}

// Verify and decode a JWT token
export function verifyApiToken(token) {
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        if (!decodedToken.email) {
            throw new Error('Invalid token: no email found');
        }

        return decodedToken;
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Unauthorized: Invalid token');
        } else if (error.name === 'TokenExpiredError') {
            throw new Error('Unauthorized: Token expired');
        } else {
            throw new Error('Unauthorized: Invalid token');
        }
    }
}

// Extract user email from JWT token
export function getUserEmailFromToken(token) {
    const decodedToken = verifyApiToken(token);
    return decodedToken.email;
} 