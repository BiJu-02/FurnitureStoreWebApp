
let blogId = null;
let imgDataUrl = [];
let quill = [];

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'link'],        // toggled buttons

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
];


for (let i=0; i<5; i++) {
    quill[i] = new Quill(`#editor${i+1}`, {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });
    imgDataUrl[i] = "";
}





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
        for (let i=0; i<5; i++) {
            if (resp.blog.bCont[i].length) { quill[i].root.innerHTML = resp.blog.bCont[i]; }
            if (resp.img[i].length) { document.getElementById(`blog-img${i+1}`).src = resp.img[i]; }
        }
    }
}


async function loadImg(file_id, img_id, idx) {
    const file = document.getElementById(file_id).files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        imgDataUrl[idx] = reader.result;
        console.log(imgDataUrl[idx].length);
        document.getElementById(img_id).setAttribute("src", imgDataUrl[idx]);
    })

    if (file) {
        reader.readAsDataURL(file);
    }
}


async function saveBlog() {
    document.getElementById("form-status").innerHTML = "submitting...";
    const blogText = [];
    for (let x of quill) {
        blogText.push(x.root.innerHTML);
    }
    console.log(blogText);
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

    if (!imgDataUrl) { alert("post saved"); return; }

    let promArr = [];

    if (imgDataUrl[0].length) {
        promArr.push((async () => {
            const rawResp2 = await fetch("https://radiancekitchens.com/radapi/postBlogImg", {
                method: "POST",
                headers: headerList,
                body: JSON.stringify({img: imgDataUrl[0], Id: blogId, Type: "t"})
            });
            const resp2 = await rawResp2.json();
            console.log(resp2);
        })());
    }

    for (let i=1; i<5; i++) {
        if (!imgDataUrl[i].length) { continue; }
        promArr.push((async () => {
            const rawResp2 = await fetch("https://radiancekitchens.com/radapi/postBlogImg", {
                method: "POST",
                headers: headerList,
                body: JSON.stringify({img: imgDataUrl[i], Id: blogId, Idx: `${i}`})
            });
            const resp2 = await rawResp2.json();
            console.log(resp2);
        })());
    }

    await Promise.all(promArr);


    alert("done");
    document.getElementById("form-status").innerHTML = "submitted";
    window.location = "https://radiancekitchens.com/radapi/adminHome";
}