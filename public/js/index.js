const dropZone = document.querySelector(".drop-zone")
const browseBtn = document.querySelector(".browseBtn")
const fileInput = document.querySelector("#fileInput")
const bgProgress = document.querySelector('.bg-progress')
const progressBar = document.querySelector('.progress-bar')
const progressContainer = document.querySelector('.progress-container')
const fileURLInput = document.querySelector('#fileURL')
const copyBtn = document.querySelector('#copyBtn')
const sharingContainer = document.querySelector('.sharing-container')
const emailForm = document.querySelector('#emailForm')
const toast = document.querySelector('.toast')

const maxAllowedSize = 100 * 1024 * 1024;

const host = "https://file-sharing-app-by-lakshya.herokuapp.com/"
const uploadURL = host+"api/files";
const emailURL = host+"api/files/send";
const percentDiv = document.querySelector("#percent");

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    } 
})

dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragged");
})

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    // console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
})

fileInput.addEventListener("change", ()=>{
    uploadFile();
})

browseBtn.addEventListener("click", ()=> {
    fileInput.click();
})

copyBtn.addEventListener("click", ()=> {
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Link Copied");

})

const uploadFile = () => {
    
    if(fileInput.files.length > 1){
        resetFileInput();
        showToast("Upload only 1 file!");
        return;
    }
    const file = fileInput.files[0];

    if(file.size > maxAllowedSize){
        resetFileInput();
        showToast("Can't upload more than 100mb file");
        return;
    }
     
    progressContainer.style.display = "block";
    
    const formData = new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            // console.log(xhr.response);
            onUploadSuccess(JSON.parse(xhr.response));
        }
    }
    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = (err) => {
        resetFileInput();
        showToast(`Error in upload ${xhr.statusText}`);

    }
    xhr.open("POST", uploadURL);
    xhr.send(formData);
    return;

}

const updateProgress = (e) => {
    const percent = Math.round((e.loaded/e.total)*100);
    // console.log(percent);
    bgProgress.style.width = percent + "%";
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`;
}

const onUploadSuccess = ({file : url}) => {
    resetFileInput();
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURLInput.value = url;
}

const resetFileInput = () => {
    fileInput.value = null;
}

emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url =  fileURLInput.value;
    const formData = {
        uuid: url.split("/").splice(-1,1)[0],
        emailTo: emailForm.elements.namedItem("to-email").value,
        emailFrom: emailForm.elements.namedItem("from-email").value
    }
    // console.table(formData);

    emailForm[2].setAttribute("disabled", "true");

    fetch(emailURL,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    }).then((res) => res.json())
    .then(({success}) => {
        if(success){
            sharingContainer.style.display = "none";
            showToast("Email Sent");

        }
    })

})

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%,0)";
    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%,60px)";
    },2000);
}

