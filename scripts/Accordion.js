"use strict";

const accordions = document.querySelectorAll(".accordion__btn");
// console.log('accordions: ', accordions);
const accordionContents = document.querySelectorAll(".accordion__content");
// console.log('accordionContents: ', accordionContents);

accordions.forEach((itemAcc) => {
  // console.log('item: ', item);
  itemAcc.addEventListener("click", (event) => {
    event.preventDefault();

    // block following after the clicked target
    const context = itemAcc.nextElementSibling;
    // console.log('context: ', context);

    // open by click
    // לפתוח בלחיצה
    if (context.style.maxHeight) {
      // console.log("yes");
      context.style.maxHeight = null;
      itemAcc.classList.remove("is-open");
    } else {
      // console.log("no");
      context.style.maxHeight = context.scrollHeight + "px";
      // console.log(context.scrollHeight);
      itemAcc.classList.add("is-open");
    }

    // close opened if another opening
    // אחר div סוגרים אחרים אם רוצים לפתוח
    accordionContents.forEach((itemCon) => {
      // console.log('item: ', item);
      if (itemCon != context) {
        // console.log("itemCon: ", itemCon);
        itemCon.style.maxHeight = null;
      }
    });

    // (treat a bug) return a plus instead of a minus at closing forEach
    // מחזרים מינוס
    accordions.forEach((item) => {
      if (item != itemAcc) {
        item.classList.remove("is-open");
      }
    });
  });
});
