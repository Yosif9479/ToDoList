export function getCookie(name: string)
{
    const value: string = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length != 2) return null;
    
    return parts.pop().split(';').shift();
}