export type NewsArticle = {
  id: number;
  title: string;
  date: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
};

export const newsData: NewsArticle[] = [
  {
    id: 1,
    title: "Initial Website Development!",

    date: "August 17th, 2026",

    image: "Images/news/Xox Twitch Banner.png",

    shortDescription: "The Official Xoxxly Website development begins!",

    fullDescription: `
    The official Xoxxly website's development is officially underway!

    I have started developing the official site for Xoxxly, and I'm excited to get this project underway and document my updates along the way.

    This website will serve as the main hub for all of our latest news and updates across all social platforms, as well as merchandise, announcements and other information.

    There are still plenty of features that are being worked on, so expect additional updates in the future.
    `
    
  },

  {
    id: 2,

    title: "New Update!",

    date: "August 18th, 2026",

    image: "Images/news/xoxxlybadge3-72.png",

    shortDescription: "The Website has been Updated with new features!",

    fullDescription: `
    The Website has received a major update.

    Serveral new features have been added, including a finalized design of the taskbar, along with a completed global header. Some visual improvements have also been made with the introduction of several images to catch the eye.

    More improvements will be coming soon.
    `
  },

  {
    id: 3,

    title: "Website Design Completion!",

    date: "August 20th, 2026",

    image: "Images/news/BlackText.png",

    shortDescription: "The Websites visual features are completed!",

    fullDescription: `
    The websites visual features have fully been implemented and are ready to be viewed!

    Please bare in mind that the functionality of the website is still underway, and only basic functions such as sidebar and header buttons will be available to use as of the current moment.

    Advanced functionality such as account management, news commenting tied to accounts, and admin account functions will be adding in the near future.

    Stay tuned for additional Updates!
    `
  },

  {
    id: 4,

    title: "Xoxxly Youtube on the way!",

    date: "August 21st, 2026",

    image: "Images/news/LogoInverted-Text.png",

    shortDescription: "A Youtube channel for Xoxxly is currently being planned!",

    fullDescription: `
    A new Youtube channel for Xoxxly is currently being planned, and once live will be implemented into this website under the socials section!

    Any major updates to the Youtube Channel and other socials will be posted here, so make sure to keep an eye on the news and updates from here on out!
    `
  },

  {
    id: 5,

    title: "Website Overhaul!",

    date: "September 7th, 2026",

    image: "Images/News/WebOverhaul.png",

    shortDescription: "The website is getting a complete overhaul!",

    fullDescription: `
    I wasn't happy with the original websites overall design, so I have decided to do a complete website overhaul for the visuals!

    The core content is all the same, although News comments have been removed for the time being. Should there be enough demand, I will re-implement the news comments functionality into the new overhauled site.

    This new site features all the core content compressed into a single landing page, removing the need for both a sidebar and header, making it cleaner.

    The new site also features a bunch of smooth animations for visual appearance, and has room for more sections to be added in future.

    There is a section for a Merch store to be developed and added, however that project has yet to be started. Keep an eye out for it though as its coming soon!
    `
  },

  {
    id: 6,

    title: "Site Style Adjustments!",

    date: "September 9th, 2026",

    image: "Images/News/StyleAdj.png",

    shortDescription: "Some new style adjustments have been added to suit differing screen sizes!",

    fullDescription: `
    I have added behind the scenes styling adjustments so that the website is better suited for multiple different screen sizes.

    Previously it was just one global size which did not look good on a resized screen, and mobile support was none existant as well.

    The new adjustments limit the max size the content on the screen can be, making the page more visually appealing even at full scale. If the page is not full scale, the core content will take up the entire width of the page to make it easier for people to read.

    Mobile support will come in future updates, so please keep an eye out for that!
    `
  },

  {
    id: 7,

    title: "Website Mobile Support",

    date: "September 10th, 2026",

    image: "Images/News/Mobile.png",

    shortDescription: "Mobile support is now live!",

    fullDescription: `
    Mobile support to the website has now been added!

    The site layout has been adjusted to visually suit both computer and mobile now, with no core content cutting out of the screen.

    If there is any bugs you can see, please report it to me immediately so I can adjust.

    Merch store development will begin soon, as well as SEO adjustments!
    `
  },

  {
    id: 8,

    title: "Merch Store Dev Underway!",

    date: "September 10th, 2026",

    image: "Images/News/Merch.png",

    shortDescription: "The development for the Merch store is now officially underway!",

    fullDescription: `
    The merch store has officially started being developed!

    The layout for all devices, as well as all visual designs will be done together, so a future update regarding that will take some time.

    The functionality will take a while to get done, and will be developed after the visual sides of things are done so opinions on visuals from the community can start flowing in.

    The Merch store will be connected to a Print on Demand service (Fourth Wall) to handle the actual physical merch, however all orders, and items and carts will be handled through the official Xox website while the backend handles shipping the orders etc.

    Stay tuned for any and all updates regarding the merch store!
    `
  },

  {
    id: 9,

    title: "SEO adjustments Underway!",

    date: "September 11th, 2026",

    image: "Images/News/SEO.png",

    shortDescription: "SEO adjustments for site visibility have started!",

    fullDescription: `
    Search Engine Optimization (SEO) has begun!

    I am currently making adjustments so that the site is clearly visible to the entire world, and shows up first upon all relavant search results.

    The site was developed in Japan however it will be most relavant in the United States, however global community members do not have to worry, as other countries are being taken into consideration.

    All relevant search terms will be listed below once SEO adjustments are completed, so stay tuned for that!
    `
  }
]