var counter = 0;
function changeBG(){
    var imgs = [
        "url(https://images4.alphacoders.com/679/thumb-1920-679460.jpg)",
        "url(https://images5.alphacoders.com/490/thumb-1920-490725.png)",
        "url(https://images2.alphacoders.com/273/thumb-1920-273890.jpg)",
        "url(https://images5.alphacoders.com/887/thumb-1920-887364.jpg)",
        "url(https://images4.alphacoders.com/797/thumb-1920-797085.jpg)",
        "url(https://images8.alphacoders.com/547/thumb-1920-547394.jpg)",
        "url(https://images.alphacoders.com/825/thumb-1920-825527.jpg)",
        "url(https://images5.alphacoders.com/286/thumb-1920-286095.jpg)"
    ]

    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);
    counter++;
}

setInterval(changeBG, 3000);
