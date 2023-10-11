const EMAIL_INVALID = 'Enter the valid email address.';
const EMAIL_NOT_UNIQUE = 'Enter the unique email address.';

export function validateEmail(email: string): string {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = re.test(email.toLowerCase());
    return `${valid ? '' : EMAIL_INVALID}`;
}

export function uniqueEmail(user: any, recipients: any[], val: string): string {
    if (user.contact_uuid) {
        return '';
    }
    let sameEmailUsers: any[] = [];
    if (val) {
        sameEmailUsers = recipients.filter((u) => {
            if (u.key !== user.key) {
                return u.email.toLowerCase() === val.toLowerCase();
            }
            return u;
        });
    } else {
        sameEmailUsers = recipients.filter(
            (u) => u.email.toLowerCase() === user.email.toLowerCase()
        );
    }
    const invalid = sameEmailUsers.length > 1;
    return `${invalid ? EMAIL_NOT_UNIQUE : ''}`;
}

const requiredFields: Record<string, Record<string, boolean>> = {
    recipient: {
        email: true,
        firstName: true,
        lastName: true,
        title: false,
    },
};

export const checkFieldValid = (
    field: string,
    val: string,
    type: string,
    user: any,
    users: any[]
): boolean => {
    if (field === 'email') {
        const uniqueError = uniqueEmail(user, users, val);
        const invalidEmail = validateEmail(val);
        return !invalidEmail && !uniqueError;
    }
    if (requiredFields[type][field]) {
        return val !== '';
    }
    return true;
};
