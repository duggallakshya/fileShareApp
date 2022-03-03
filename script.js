const File = require("./models/file");
const fs = require('fs');
const connectDB = require("./config/db");

async function deleteData(params) {
    // fetch and delete 24 hours files in db
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const files = File.find({ createdAt: { $lt: pastDate}});
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            }catch(err){
                console.log(`error while deleting ${err}`);
            }
        }
    }
}

deleteData().then(process.exit);