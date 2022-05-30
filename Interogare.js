const interogari = [
    "A private company that provides online access to public record.",
    "Online stock.",
    "A major provider of Internet access to commercial services plans to add content and high-quality service.",
    "Intranets are company-wide networks based on the Internet protocol.",
    'Systems integrators and large corporations providing for "either clandestine side payments, discounts on the Microsoft desktop operating system.',
    "The legal clash comes at a critical point as both Netscape and Microsoft are introducing new versions of their respective browsers.",
    "It said Monday that more than one million users have downloaded its latest Internet Explorer version in its first week of availability.",
    "Netscape and Microsoft are already well along the way to developing the next version of their browser software.",
    "We think the company is extremely well positioned to take advantage of the opportunities in this nascent environment we're in, in both the consumer online Internet market as well as the Corporate Internet Services.",
    "CompuServe has addressed subscriber declines by upgrading its infrastructure to improve speed and performance and is releasing a new software product.",
    "New partnerships with IBM, Netscape Communications Corp, Microsoft Corp and Oracle Corp provide comprehensive intranet-hosting platforms.",
    "In launching the latest version of Navigator, Mountain View, Calif.-based Netscape highlighted a new electronic mail feature that will deliver information from selected content providers directly to the user's computer .",
    "Microsoft also pointed out that its product is free, while Netscape charges most users a $49 license fee after a free 90-day trial period.",
    "Microsoft officials said versions for previous versions of Windows and for Apple Computer Inc.'s Macintosh system were forthcoming.",
    "Novell has been a leader since 1983 in conventional networking software but has fallen behind Netscape Communications Corp. and Microsoft Corp. in the competition for intranets, private networks which function like the Internet's Web.",
    "The company said IntranetWare is compatible with existing Novell network software and will allow companies to preserve previous investments in network software. ",
]
const giveMeAnInterogation = (item) => {
    const ar = parseInt(Math.random() * item.length);
    return item[ar];
}
const oneRandomInterogation = giveMeAnInterogation(interogari);
module.exports = oneRandomInterogation
