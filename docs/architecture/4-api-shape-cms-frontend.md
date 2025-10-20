# 4) API Shape (CMS → Frontend)

-   Base: `https://cms.fiftyfifty.org/api`
-   `GET /phases?populate=modules.modules,resources`
-   `GET /modules/:slug?populate=resources`
-   Localization via `?locale=en|ar`
-   ISR revalidation every 5--15 min
