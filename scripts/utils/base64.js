// =====================
// Base64
// =====================

function isBase64(str) {
    const regex = new RegExp(
        '^(?:[A-Za-z0-9+/]{4})*' +
        '(?:[A-Za-z0-9+/]{2}==|' +
        '[A-Za-z0-9+/]{3}=)?$'
    );

    if (!regex.test(str)) {
        return false;
    }
    
    try {
        const decoded = Buffer
        .from(str, 'base64')
        .toString('utf8');
        return /^[\x20-\x7E\s]*$/
        .test(decoded);
    } catch (e) {
        return false;
    }
}

export function encode(str) {
    if (!str) return null;
    try {
        return Buffer
        .from(str, 'utf8')
        .toString('base64');
    } catch {
        return str;
    }
}

export function decode(str) {
    if (!str) return null;
    if (!isBase64(str)) {
        return str;
    }
    try {
        return Buffer
        .from(str, 'base64')
        .toString('utf8');
    } catch {
        return str;
    }
}