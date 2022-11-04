const router = require("express")();
const cheerio = require("cheerio");
const { AxiosService } = require("./helper/axios_service");
const { responseApi } = require("./helper/response_api");
const baseUrl = "https://komikcast.site";

router.get("/baca/:url", async (req, res) => {
  try {
    const response = await AxiosService(`${baseUrl}/${req.params.url}`);
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content > .wrapper");
      let title;
      const panel = [];
      title = element.find(".chapter_headpost > h1").text().trim();
      element
        .find(".chapter_ > #chapter_body > .main-reading-area > img")
        .each((i, data) => {
          panel.push($(data).attr("src"));
        });

      komikList.push({ title, panel });

      return responseApi(res, 200, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, 500, "failed");
  }
});

router.get("/search", async (req, res) => {
  try {
    const response = await AxiosService(`${baseUrl}/?s=${req.query.keyword}`);
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(
        "#content > .wrapper > .postbody > .dev > #main > .list-update"
      );
      let title, href, thumbnail, type, last_chapter, rating;

      element
        .find(
          ".list-update_items > .list-update_items-wrapper > .list-update_item"
        )
        .each((i, data) => {
          title = $(data).find("a > .list-update_item-info > h3").text().trim();
          href = $(data).find("a").attr("href");
          type = $(data)
            .find("a > .list-update_item-image > .type")
            .text()
            .trim();
          rating = $(data)
            .find(
              "a > .list-update_item-info > .other > .rate > .rating > .numscore"
            )
            .text()
            .trim();
          last_chapter = $(data)
            .find("a > .list-update_item-info > .other > .chapter")
            .text()
            .trim();
          thumbnail = $(data)
            .find("a > .list-update_item-image > img")
            .attr("src");
          komikList.push({
            title,
            type,
            last_chapter,
            rating,
            href: href.substring(28, href.length),
            thumbnail,
          });
        });

      return responseApi(res, response.status, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, 500, "failed");
  }
});

router.get("/detail/:url", async (req, res) => {
  try {
    const response = await AxiosService(`${baseUrl}/manga/${req.params.url}`);
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content > .wrapper > .komik_info");
      let title,
        thumbnail,
        description,
        status,
        type,
        released,
        author,
        posted_by;
      const chapter = [];
      const genre = [];

      title = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > h1"
        )
        .text()
        .trim();

      released = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(1)"
        )
        .text()
        .trim();
      author = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(2)"
        )
        .text()
        .trim();
      status = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(3)"
        )
        .text()
        .trim();
      type = element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-meta > span:nth-child(4)"
        )
        .text()
        .trim();

      description = element
        .find(
          ".komik_info-body > .komik_info-description > .komik_info-description-sinopsis > div > div:nth-child(1) > p"
        )
        .text()
        .trim();
      thumbnail = element
        .find(".komik_info-cover-box > .komik_info-cover-image > img")
        .attr("src");

      element
        .find(".komik_info-body > .komik_info-chapters > ul > li")
        .each((i, data) => {
          const title = $(data).find("a").text().trim();
          const href = $(data).find("a").attr("href");
          const date = $(data).find(".chapter-link-time").text().trim();
          chapter.push({ title, href: href.substring(28, href.length), date });
        });

      element
        .find(
          ".komik_info-body > .komik_info-content > .komik_info-content-body > .komik_info-content-genre > a"
        )
        .each((i, data) => {
          genre.push($(data).text().trim());
        });

      komikList.push({
        title,
        status,
        type,
        released,
        author,
        genre,
        description,
        thumbnail,
        chapter,
      });
      return responseApi(res, 200, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, 500, "failed");
  }
});

router.get("/popular", async (req, res) => {
  try {
    const response = await AxiosService(baseUrl);
    const komikList = [];
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".mainholder > #content");
      let title, href, rating, thumbnail, lastchapter;
      element
        .find(".wrapper > .hotslid > .bixbox.hothome.full > .listupd > .bs")
        .each((i, data) => {
          href = $(data).find(".bsx > a").attr("href");
          thumbnail = $(data).find(".bsx > a > .limit > img").attr("src");
          title = $(data).find(".bsx > a > .bigor > .tt").text().trim();
          lastchapter = $(data)
            .find(".bsx > a > .bigor > .adds > .epxs")
            .text()
            .trim();
          rating = $(data)
            .find(".bsx > a > .bigor > .adds > .rt > .rating > .numscore")
            .text()
            .trim();
          href = href.substring(27, href.length);
          komikList.push({ title, href, rating, thumbnail, lastchapter });
        });
      return responseApi(res, 200, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, 500, "failed");
  }
});

router.get("/recommended", async (req, res) => {
  try {
    const response = await AxiosService(baseUrl);
    let komikList = [];
    if (response.status === 200) {
      let title, href, rating, type, genre, description, thumbnail;
      const $ = cheerio.load(response.data);
      const element = $(".mainholder");
      element
        .find(".big-slider > .swiper-wrapper > .swiper-slide")
        .each((i, data) => {
          href = $(data).find("a").attr("href");
          title = $(data)
            .find(
              "a > .mainslider > .limit > .sliderinfo > .sliderinfolimit > span.name"
            )
            .text()
            .trim();
          rating = $(data)
            .find(
              "a > .mainslider > .limit > .sliderinfo > .sliderinfolimit > .meta > span.quality"
            )
            .text()
            .trim();
          type = $(data)
            .find(
              "a > .mainslider > .limit > .sliderinfo > .sliderinfolimit > .meta > span.text > b"
            )
            .text()
            .trim();
          genre = $(data)
            .find(
              "a > .mainslider > .limit > .sliderinfo > .sliderinfolimit > .meta > span.text:nth-child(3)"
            )
            .text()
            .trim();
          description = $(data)
            .find(
              "a > .mainslider > .limit > .sliderinfo > .sliderinfolimit > .desc > p"
            )
            .text()
            .trim();

          thumbnail = $(data)
            .find("a > .mainslider > .limit > .bigbanner")
            .attr("style")
            .match(/'(.*)'/)[1];
          href = href.substring(27, href.length);
          komikList.push({
            title,
            href,
            rating,
            type,
            genre,
            description,
            thumbnail,
          });
        });
      return responseApi(res, 200, "success", komikList);
    }
    return responseApi(res, response.status, "failed");
  } catch (er) {
    console.log(er);
    return responseApi(res, 500, "failed");
  }
});

module.exports = { router };
