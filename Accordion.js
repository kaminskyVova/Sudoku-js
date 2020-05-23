"use strict";

const accordions = document.querySelectorAll(".accordion__btn");
// console.log('accordions: ', accordions);
const accordionContents = document.querySelectorAll(".accordion__content");
// console.log('accordionContents: ', accordionContents);

accordions.forEach((itemAcc) => {
  // console.log('item: ', item);
  itemAcc.addEventListener("click", (event) => {
    event.preventDefault();

    // следующий за таргетом по клику блок
    const context = itemAcc.nextElementSibling;
    // console.log('context: ', context);

    // открываем по клику
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

    // закрываем открытый если другой открываем
    accordionContents.forEach((itemCon) => {
      // console.log('item: ', item);
      if (itemCon != context) {
        console.log("itemCon: ", itemCon);
        itemCon.style.maxHeight = null;
      }
    });

    // (лечим баг)возвращаем плюс вместо минуса при закрытии forEach
    accordions.forEach((item) => {
      if (item != itemAcc) {
        item.classList.remove("is-open");
      }
    });
  });
});
