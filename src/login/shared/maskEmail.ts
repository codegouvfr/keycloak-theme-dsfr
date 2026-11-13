/** Masque une adresse email : "bob@gmail.com" -> "b***@gmail.com". */
export function maskEmail(email: string | undefined): string | undefined {
    if (email === undefined || !email.includes("@")) {
        return undefined;
    }
    const [local, domain] = email.split("@");
    return `${local.slice(0, 1)}***@${domain}`;
}
