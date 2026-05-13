const ROLE_ALIASES = {
    admin: ['admin'],
    staff: ['staff', 'admin'],
    hr: ['hr', 'admin'],
};

export const getClaimRoles = (claims = {}) => {
    const roles = new Set();

    ['admin', 'staff', 'hr'].forEach((role) => {
        if (claims[role] === true) roles.add(role);
    });

    if (typeof claims.role === 'string') {
        roles.add(claims.role.toLowerCase());
    }

    if (Array.isArray(claims.roles)) {
        claims.roles.forEach((role) => {
            if (typeof role === 'string') roles.add(role.toLowerCase());
        });
    }

    return roles;
};

export const hasAnyRole = (claims = {}, allowedRoles = []) => {
    const userRoles = getClaimRoles(claims);

    return allowedRoles.some((role) => {
        const acceptedRoles = ROLE_ALIASES[role] || [role];
        return acceptedRoles.some((acceptedRole) => userRoles.has(acceptedRole));
    });
};

export const hasStaffAccess = (claims = {}) => hasAnyRole(claims, ['staff', 'hr', 'admin']);
