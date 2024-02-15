let locations = {
    "bedfont cafe": {
        ratings: [
            {
                tag: "Lactose intolerant",
                star: 3.3,
                comment: {
                    username: "bigkid2008",
                    comment:
                        "it is not shown on the main menu, but if you can ask for a allergy specific menu.",
                },
            },
            {
                tag: "Nut allergic",
                star: 4.8,
                comment: {
                    username: "xXfunnyinternetuserXx",
                    comment:
                        "the restaurant does not have any nut related dishes",
                },
            },
            {
                tag: "Vegan",
                star: 4.5,
                comment: {
                    username: "i eat dried fibres",
                    comment: "all vegan entries are clearly marked on the menu",
                },
            },
        ],
    },
    "hatton cross station": {
        ratings: [
            {
                tag: "Blind",
                star: 1.7,
                comment: {
                    username: "honestly cannot see",
                    comment:
                        "i almost died going down the stairs, but luckily i had feather falling on and only took 2 hearts of damage",
                },
            },
            {
                tag: "Wheelchaired",
                star: 1.2,
                comment: {
                    username: "grumpy02",
                    comment:
                        "i had to take a bus to heathrow just to get that step free access, what a waste of time",
                },
            },
            {
                tag: "Deaf",
                star: 4.2,
                comment: {
                    username: "ears2007",
                    comment: "not too crowded, very easy to navigate",
                },
            },
        ],
    },
    "cisco cafe": {
        ratings: [
            {
                tag: "Vegan",
                star: 1.1,
                comment: {
                    username: "hungryman_",
                    comment: "no food for me",
                },
            },
            {
                tag: "Average",
                star: 4.2,
                comment: {
                    username: "atypicalhumanbeing",
                    comment:
                        "nice meal but my entire hand is full of sauce afterwards",
                },
            },
            {
                tag: "American",
                star: 4.9,
                comment: {
                    username: "iamverywide",
                    comment: "a very classic cisco burger yum, i ate 3",
                },
            },
        ],
    },
};

let info = locations[param];

let overall =
    Math.round(
        (info.ratings
            .map((item) => item.star)
            .reduce((partialSum, a) => partialSum + a, 0) /
            info.ratings.length) *
            10,
    ) / 10;
let right = document.getElementById("right");

right.innerHTML += `<h2>Overall rating: ${overall} ${"⭐".repeat(Math.round(overall))}</h2>`;
right.innerHTML += `<table>${info.ratings.map((entry) => `<tr><td><span class="tag">${entry.tag}</span></td><td>${entry.star}/5 ${"⭐".repeat(Math.round(entry.star))}</td></tr>`).join("")}</table>`;
right.innerHTML += `<div id="comments">${info.ratings.map((entry) => `<div class="comment"><span class="tag">${entry.tag}</span><span class="username">${entry.comment.username}</span><span class="singlerating">${"⭐".repeat(Math.round(entry.star - 0.2))} ${Math.round(entry.star - 0.2)}/5</span><p class="content">${entry.comment.comment}</p></div>`).join("")}</div>`;
right.innerHTML += `<div id="leavecomment"><span>Leave rating as </span><span class="tag">Lactose intolerant</span><span class="tag">Vegan</span><br/><textarea rows="4" cols="50"></textarea><span id="stars">⭐<span>⭐<span>⭐<span>⭐<span>⭐</span></span></span></span></span><span id="send">Rate</span></div>`;
