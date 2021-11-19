let db;

const request = indexedDB.open("budget-tracker",1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement:true})
};


