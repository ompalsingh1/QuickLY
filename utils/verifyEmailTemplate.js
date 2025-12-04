const verificationEmailTemplate = (name,url) =>{
    return `
    <p> dear ${name}</p>
    <p> verify for QuickLy</p>
    <a> href=${url}
    verify
    </a>
    `
}

export default verificationEmailTemplate