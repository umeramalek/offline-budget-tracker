let db;

const request = indexedDB.open("budget-tracker",1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement:true})
};


request.onsuccess = function(event){
    db = event.target.result;
    if (navigator.onLine){
        dataBase()
    }
};

request.onerror = function(event){
    console.log("Error : " + event.target.errorCode); 
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
};

function dataBase(){
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    const getAll = store.getAll();

    getAll.onsuccess = function(){
        if (getAll.result.length > 0){
            fetch("api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                header: {
                    Accept : "application/json, text/plin, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            })
        }
    };
}