
let blogId = null;
let imgDataUrl = "";
let quill = null;

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'link'],        // toggled buttons

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
];
quill = new Quill('#editor', {
    modules: { toolbar: toolbarOptions },
    theme: 'snow'
});



async function initPage(Id) {
    

    // get blog and load quill.root.innerhtml
    if (Id.length) {
        blogId = Id;
        const headerList = {
            "Accept": "*/*"
        }
        const rawResp = await fetch(`https://radiancekitchens.com/radapi/blogPost?Id=${Id}&&api=1`, {
            method: "GET",
            headers: headerList
        });

        const resp = await rawResp.json();
        console.log(resp);
        document.getElementById("blog-title").value = resp.blog.bHead;
        quill.root.innerHTML = resp.blog.bCont;
        document.getElementById("blog-img").src = resp.img;
    }
}


async function loadImg() {
    const file = document.getElementById("input-image").files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        imgDataUrl = reader.result;
        console.log(imgDataUrl);
        document.getElementById("blog-img").setAttribute("src", imgDataUrl);
    })

    if (file) {
        reader.readAsDataURL(file);
    }
}


async function saveBlog() {
    document.getElementById("form-status").innerHTML = "submitting...";
    const blogText = quill.root.innerHTML;
    const headerList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
    }
    if (!document.getElementById("blog-title").value.length)
    { alert("no heading received for the blog"); return; }
    let bodyContent = {
            head: document.getElementById("blog-title").value,
            cont: blogText
    }
    if (blogId) {
        bodyContent["Id"] = blogId;
    }
    const rawResp = await fetch("https://radiancekitchens.com/radapi/postBlog", {
        method: "POST",
        headers: headerList,
        body: JSON.stringify(bodyContent)
    });

    const resp = await rawResp.json();
    console.log(resp);
    if (blogId && resp.updateSuccess) {
        console.log("blog content updated");
    } else if (resp.data) {
        console.log("blog created with new content");
        blogId = resp.data;
    } else {
        console.log("ded");
        return;
    }
    console.log("img size", imgDataUrl.length);
    if (!imgDataUrl) { alert("post saved"); return; }
    const rawResp2 = await fetch("https://radiancekitchens.com/radapi/postBlogImg", {
        method: "POST",
        headers: headerList,
        body: JSON.stringify({img: imgDataUrl, Id: blogId})
    });
    const resp2 = await rawResp2.json();
    console.log(resp2);
    if (resp2.err) {
        console.log("image not uploaded");
    }
    else {
        console.log(resp2.data);
    }
    alert("post saved");
}