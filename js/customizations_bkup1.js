// var app_url_prefix = `/sadananda-new-web`
var app_url_prefix = ''
var SAVE_CONTACT_API_URL = `https://wfnov0cx4f.execute-api.us-east-2.amazonaws.com/Prod/api/saveContact`
var load_results = {
    'banner' : 0,
    'initiative' : 0,
    'about_us' : 0
}

init = function() {
    var s= $(".nav");
    s.find("li").each(function(){
        $(this).children("ul").length && $(this).append("<span>+</span>")
    })
    s.find("li > span").on("click",function(e){
        e.preventDefault(),
        $(this).text("+"==$(this).text()?"-":"+"),
        $(this).siblings("ul").slideToggle(300)
    })
    $(".button-burger").on("click",function(e){
        $(this).toggleClass("active"),
        s.slideToggle(300)
        e.preventDefault()
    })

    var window_width = $(window).width();
    console.log('Window width', window_width)
    if( window_width <= 1023 ){
        $('.nav').toggle('collapse');
    }
}

initCarousel = function(id) {
    
    let items = document.querySelectorAll('.carousel .carousel-item')
    items.forEach((el) => {
        const minPerSlide = 4
        let next = el.nextElementSibling
        for (var i=1; i<minPerSlide; i++) {
            if (!next) {
                // wrap carousel by using first child
                next = items[0]
            }
            let cloneChild = next.cloneNode(true)
            el.appendChild(cloneChild.children[0])
            next = next.nextElementSibling
        }
    });

    if($.trim(id).length <= 0) {
        return;
    }
    const initiativeCarousel = document.querySelector(id);
    if(window.matchMedia("(min-width:576px)").matches) {
        
        console.log('Disabling the slide for large screen devices')
        $(initiativeCarousel).removeClass('slide')
        $(initiativeCarousel).removeAttr('data-bs-ride')
        const carousel = new bootstrap.Carousel(initiativeCarousel, {
            interval: 0
        })

    } else {
        console.log('Enabling the slide for small screen devices')
        $(initiativeCarousel).addClass('slide')
        $(initiativeCarousel).attr('data-bs-ride', 'carousel')
        const carousel = new bootstrap.Carousel(initiativeCarousel, {
            interval: 3000
        })
    }
}

loadBanners = function(page, cb) {


    console.log('Loading banner data for page:' + page)
    
    const url = `${app_url_prefix}/data/banner/${page}.dat`
    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                // console.log("Banner data:", data);
                const lines = data.split('\n').filter((line) => {
                    return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
                })
                // console.log('Lines', lines)
                var banners = []
                lines.forEach((line) => {
                    const tokens = line.split('sub-heading=')
                    if(tokens.length == 2) {
                        const parts = tokens[0].split(',')
                        const image = $.trim(parts[0].substr(parts[0].indexOf('image=')+6))
                        const heading = $.trim(parts[1].substr(parts[1].indexOf('heading=')+8))
                        
                        banners.push( {
                            image: image,
                            heading: heading,
                            sub_heading: tokens[1]
                        })
                    }
                })
                // console.log('Banners', banners)
                cb(undefined, banners)
            },
            error: (request, status, error) => {
                console.error('Failed to get the banner data')
                console.error('Request', request)
                console.error('Status', status)
                console.error('Error', error)
                cb(error, undefined)
            }
        });
    } catch(ex) {
        console.log('Exception occurred while loading the banners data', ex)
        cb(ex, undefined)
    }
}

getNormalizedImageSizeBasedOnWindowWidth = function() {
    var window_width = $(window).width();
    if(window_width <= 300) {
        return "300"
    } else if(window_width > 300 && window_width <= 400) {
        return "400"
    } else if(window_width > 400 && window_width <= 500) {
        return "500"
    } else if(window_width > 500 && window_width <= 600) {
        return "600"
    } else if(window_width > 600 && window_width <= 700) {
        return "700"
    } else if(window_width > 700 && window_width <= 800) {
        return "800"
    } else if(window_width > 800 && window_width <= 900) {
        return "900"
    } else if(window_width > 900 && window_width <= 1000) {
        return "1000"
    } else if(window_width > 1000) {
        return "default"
    }
}

updateImagePathAsperNormalizedImage = function(imgPath) {
    console.log('Input img path', imgPath);
    const normalizedImagePath = getNormalizedImageSizeBasedOnWindowWidth();
    if(normalizedImagePath == "actual") {
        console.log('Updated path is same as it is actual');
        return imgPath    //dont update and use it as it is
    } else {
        const index = imgPath.indexOf('images/');
        if(index != -1) {
            const resultPath = imgPath.substr(0, index + 6) + "/" + normalizedImagePath + "/" + imgPath.substr(index + 7);
            console.log('Updated path is', resultPath);
            return resultPath
        }
    }
    console.log('No change in the path');
    return imgPath;
}
renderBanner = function(id, bannerdata) {
    const bannertemplate = `<div class="slide-container" >
			<!-- <div class="image" id="image-<REPLACE_BANNER_ID>"></div> -->
			<img src="<REPLACE_IMAGE>" />
            <div class="banner-content">
            <h2 class="banner-title"><REPLACE_HEADING></h2>
            <p class="banner-details"><REPLACE_SUBHEADING></p>
        </div>

		</div>`
    var bannerHTML = []
    var index=1;
    bannerdata.forEach((banner) => {
        var tmp = bannertemplate.replace("<REPLACE_IMAGE>", updateImagePathAsperNormalizedImage(banner.image));
        tmp = tmp.replace("<REPLACE_SUBHEADING>", banner.sub_heading);
        tmp = tmp.replace("<REPLACE_HEADING>", banner.heading);
        tmp = tmp.replace("<REPLACE_BANNER_ID>", index);
        bannerHTML.push(tmp);
        index++;
    })
    $(id).html(bannerHTML.join(''))
    index=1;
    bannerdata.forEach((banner) => {
        $(id + ' #image-' + index).css('background-image', 'url("' + banner.image + '")');
        $(id + ' #image-' + index).css('background-repeat', 'no-repeat');
        $(id + ' #image-' + index).css('background-size', 'cover');
        $(id + ' #image-' + index).css('background-position', 'center');
        $(id + ' #image-' + index).css('background-attachment', 'scroll');

        $(id + ' #image-' + index).css('padding', 0);
        $(id + ' #image-' + index).css('width', 'inherit');
        $(id + ' #image-' + index).css('height', 'inherit');

        index++;
    })
}

pushSchemeUnderInitiative = function(initiatives, initiative_id, scheme_details) {

    const selected_initiative_list = initiatives.filter((initiative) => {
        return initiative.id == initiative_id
    })
    if(selected_initiative_list.length <= 0) {
        console.log('Failed to find the initiative:' + initiative_id + ' in the given list')
        return;
    }
    var selected_initiative = selected_initiative_list[0];  //TAKE THE FIRST ONE
    var schemes = selected_initiative['schemes']
    if(schemes == null) {
        schemes = {}
    }
    const scheme_id = scheme_details['id']
    schemes[scheme_id] = scheme_details;
    selected_initiative['schemes'] = schemes;
}

loadInitiatives = function(cb) {

    //init the UI on the navigations...
    init();

    const url = `${app_url_prefix}/data/initiatives/index.dat`;
    console.log('Loading initiatives from:', url)

    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                // console.log("Banner data:", data);
                const lines = data.split('\n').filter((line) => {
                    return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
                })
                // console.log('Lines', lines)
                var initiatives = []
                lines.forEach((line) => {
                    if(line.indexOf('type=initiative') != -1) {
                        const tokens = line.split(',')
                        if(tokens.length == 5) {
                            
                            initiatives.push( {
                                id: tokens[0].split('=')[1],
                                type: tokens[1].split('=')[1],
                                image: tokens[2].split('=')[1],
                                name: tokens[3].split('=')[1],
                                link: tokens[4].split('=')[1],
                            })
                        }
                    } else if(line.indexOf('type=scheme') != -1) {
                        const tokens = line.split(',')
                        // id=scheme1,
                        // type=scheme,
                        // initiative_id=initiative1,
                        // image=images/adopt_grandma_grandpa.jpg,
                        // name=Adopt a Grandma / Grandpa,
                        // minimum_donation=10,
                        // currency=DOLLOR,
                        // description=To meet basic needs of one grandma/grandpa for a month

                        if(tokens.length >= 8) {
                            
                            const initiative_id = tokens[2].split('=')[1]
                            const scheme_details = {
                                id: tokens[0].split('=')[1],
                                type: tokens[1].split('=')[1],
                                initiative_id: initiative_id,
                                image: tokens[3].split('=')[1],
                                name: tokens[4].split('=')[1],
                                minimum_donation: tokens[5].split('=')[1],
                                currency: tokens[6].split('=')[1],
                                description: line.substr(line.indexOf('description=') + 12),
                            }
                            pushSchemeUnderInitiative(initiatives, initiative_id, scheme_details)
                        }
                    }
                })
                // console.log('Banners', initiatives)
                cb(undefined, initiatives)
            },
            error: (request, status, error) => {
                console.error('Failed to get the initiatives data')
                console.error('Request', request)
                console.error('Status', status)
                console.error('Error', error)
                cb(error, undefined)
            }
        });
    } catch(ex) {
        console.log('Exception occurred while loading the initiatives data', ex)
        cb(ex, undefined)
    }
}

renderInitiatives = function(id, menuid, initiatives, initiative_id) {
                

    const initiativetemplate = `<div class="carousel-item <REPLACE_ACTIVE>">
                                        <div class="col-md-3 col-sm-12">
                                            <div class="initiative-slide-container" >
                                                <div class="initiative-image">
                                                    <a href="<REPLACE_LINK>">
                                                        <img src="<REPLACE_IMAGE>" class="rounded">
                                                    </a>
                                                    <div class="slide-overlay">
                                                        <div class="slide-overlay-inner">
                                                            <a href="page-donate.html?name=<REPLACE_ID>" class="button button-white">Donate Now</a>
                                                            <a href="<REPLACE_LINK>" class="button button-white">more...</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href="<REPLACE_LINK>">
                                                    <h6 class="initiative-name">
                                                        <REPLACE_NAME>
                                                    </h6>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                `
                                
    var initiativeHTML = []
    var index = 0;
    initiatives.forEach((initiative) => {
        var tmp = initiativetemplate.replaceAll("<REPLACE_LINK>", initiative.link);
        tmp = tmp.replaceAll("<REPLACE_IMAGE>", initiative.image);
        tmp = tmp.replaceAll("<REPLACE_NAME>", initiative.name);
        tmp = tmp.replaceAll("<REPLACE_ID>", initiative.id);
        if(index == 0) {
            tmp = tmp.replaceAll("<REPLACE_ACTIVE>", "active");
        } else {
            tmp = tmp.replaceAll("<REPLACE_ACTIVE>", "");
        }
        index++;
        initiativeHTML.push(tmp)
    })
    $(id).html(initiativeHTML.join(''))
    // $(id + ' .carousel-item:first-child').toggle("active")

    const initiatives_menu_template = `<li>
                                            <a href="<REPLACE_LINK>">
                                                <REPLACE_NAME>
                                            </a>
                                        </li>`
    var initiativeMenuHTML = []
    initiatives.forEach((initiative) => {
        var tmp = initiatives_menu_template.replaceAll("<REPLACE_LINK>", initiative.link);
        tmp = tmp.replaceAll("<REPLACE_NAME>", initiative.name);
        initiativeMenuHTML.push(tmp)
    })
    $(menuid).html(initiativeMenuHTML.join(''));

    var schemeDetailsHTML  = [];
    if(initiative_id != undefined && initiative_id.length > 0) {

        const scheme_template = `
                                <div class="carousel-item <REPLACE_ACTIVE>">
                                    <div class="col-md-3 col-sm-12">
                                        <div class="initiative-slide-container" >
                                            <div class="initiative-image">
                                                <img src="<REPLACE_IMAGE>" class="rounded">
                                                <div class="slide-overlay">
                                                    <div class="slide-overlay-inner">
                                                        <a href="page-donate.html?scheme_id=<REPLACE_SCHEME_ID>&initiative_id=<REPLACE_INITIATIVE_ID>" class="button button-white">Donate Now</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <h6 class="initiative-name">
                                                <REPLACE_SCHEME_NAME>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                                `

                                /*
        const scheme_template = `<li class="slide">
                                    <div class="slide-image">
                                        <img src="<REPLACE_IMAGE>" class="rounded" height="175" width="270" alt="">
                                        
                                        <div class="slide-overlay">
                                            <div class="slide-overlay-inner">
                                                <a href="page-donate.html?scheme_id=<REPLACE_SCHEME_ID>&initiative_id=<REPLACE_INITIATIVE_ID>" class="button button-white">Donate Now</a>
                                            </div>
                                        </div>
                                    </div><!-- /.slide-image -->

                                    <div class="slide-content">
                                        <h3><REPLACE_SCHEME_NAME></h3>

                                        <p>
                                            <REPLACE_SCHEME_DESCRIPTION>
                                        </p>
                                    </div><!-- /.slide-content -->
                                </li>`
                                */
        const selected_initiative_list = initiatives.filter((initiative) => {
            return initiative['id'] == initiative_id
        })
        if(selected_initiative_list.length <= 0) {
            console.log('No initiative is found for the given initiative:' + initiative_id);
            return;
        }
        const schemes = selected_initiative_list[0].schemes;
        if(schemes == undefined) {
            console.log('No schemes are mapped to the given initiative:' + initiative_id)
            return; //no schemes are listed
        }
        const scheme_ids = Object.keys(schemes);
        index = 0;
        scheme_ids.forEach((scheme_id) => {
            const scheme_details = schemes[scheme_id];
            var tmp = scheme_template.replaceAll("<REPLACE_IMAGE>", scheme_details.image);
            tmp = tmp.replaceAll("<REPLACE_SCHEME_ID>", scheme_details.id);
            tmp = tmp.replaceAll("<REPLACE_INITIATIVE_ID>", scheme_details.initiative_id);
            tmp = tmp.replaceAll("<REPLACE_SCHEME_NAME>", scheme_details.name);
            tmp = tmp.replaceAll("<REPLACE_SCHEME_DESCRIPTION>", scheme_details.description);
            if(index == 0) {
                tmp = tmp.replaceAll("<REPLACE_ACTIVE>", "active");
            } else {
                tmp = tmp.replaceAll("<REPLACE_ACTIVE>", "");
            }
            index++;
            
            schemeDetailsHTML.push(tmp)
        })
        $(id).html(schemeDetailsHTML.join(''));
    }

    initCarousel(id);
}	

loadAboutUs = function(cb) {
    const url = `${app_url_prefix}/data/about_us.dat`;
    console.log('Loading about us from:', url)

    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                // console.log("Banner data:", data);
                const lines = data.split('\n').filter((line) => {
                    return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
                })
                // console.log('Lines', lines)
                var about_us = {}
                lines.forEach((line) => {
                    const index = line.indexOf('=')
                    if(index != -1) {
                        
                        const key = line.substring(0, index);
                        const value = line.substring(index+1)
                        about_us[key] = value
                    }
                })
                // console.log('About', about_us)
                cb(undefined, about_us)
            },
            error: (request, status, error) => {
                console.error('Failed to get the about ius data')
                console.error('Request', request)
                console.error('Status', status)
                console.error('Error', error)
                cb(error, undefined)
            }
        });
    } catch(ex) {
        console.log('Exception occurred while loading the about us data', ex)
        cb(ex, undefined)
    }
}

renderAboutUsAndSocialContacts = function(about_us_data) {

    renderAboutUS('#anandam_mini_desc', 'ABOUT_ANANDAM_MIN_DESC', about_us_data)
    renderAboutUS('#sadananda_mini_desc', 'ABOUT_SADANANDA_MIN_DESC', about_us_data)

    renderAboutUS('#anandam_detailed_desc', 'ABOUT_ANANDAM_DETAILED_DESC', about_us_data)
    renderAboutUS('#sadananda_detailed_desc', 'ABOUT_SADANANDA_DETAILED_DESC', about_us_data)
    renderSocialContacts('#social_contacts_phone', 'CONTACT_PHONE', about_us_data)
    renderSocialContacts('#social_contacts_fb', 'CONTACT_FACEBOOK_ID', about_us_data)
    renderSocialContacts('#social_contacts_twitter', 'CONTACT_TWITTER_ID', about_us_data)
    renderSocialContacts('#social_contacts_email', 'CONTACT_EMAIL_ID', about_us_data)

    renderContactUS('#contact_address', 'CONTACT_ADDRESS', about_us_data)
    renderContactUS('#contact_phone', 'CONTACT_PHONE', about_us_data)
    renderContactUS('#contact_email', 'CONTACT_EMAIL_ID', about_us_data)

    renderLegalClaim('#legalDisclaimer .modal-body', 'LEGAL_DISCLAIMER', about_us_data)
}

showLegalDisclaimer = function( ) {
    // $('#legalDisclaimer').modal({
    //     show: true,
    //     focus: true
    // })
    $('#legalDisclaimer').modal('show')
    console.log('Show legal')
}

renderLegalClaim = function(id, key, about_us_data) {
    $(id).html(about_us_data[key])
}

renderContactUS = function(id, key, about_us_data) {
    $(id).html(about_us_data[key])
}

renderAboutUS = function(id, key, about_us_data) {
    $(id).html(about_us_data[key])
}

renderSocialContacts = function(id, key, about_us_data) {
    if(about_us_data[key] && about_us_data[key].length > 0) {
        $(id).attr("href", about_us_data[key])
    } else {
        $(id).hide();
    }
}

showLoading = function(status) {
    if(status) {
        $('#loading-status').show()
        $('.wrapper, .footer ').hide()
    } else {
        $('#loading-status').hide()
        $('.wrapper, .footer').show()
    }
}
loadstatus = function(step, result) {

    showLoading(true);
    load_results[step] = result;

    if(load_results['banner'] == 1 
        && load_results['initiative'] == 1 
        && load_results['about_us'] == 1 
    ) {
        showLoading(false);
    }

}

loadGallery = function(cb) {

    console.log('Loading gallery data')

    init();

    const url = `${app_url_prefix}/data/gallery.dat`

    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                // console.log("Banner data:", data);
                const lines = data.split('\n').filter((line) => {
                    return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
                })
                // console.log('Lines', lines)
                var gallery = []
                lines.forEach((line) => {
                    const tokens = line.split(',')
                    if(tokens.length >= 2) {

                        const desc = $.trim(line.substr(line.indexOf(',')+6))
                        
                        gallery.push( {
                            image: $.trim(tokens[0].substr(tokens[0].indexOf("=") + 1)),
                            desc: desc,
                        })
                    }
                })
                // console.log('Gallery Details', gallery)
                cb(undefined, gallery)
            },
            error: (request, status, error) => {
                console.error('Failed to get the gallery data')
                console.error('Request', request)
                console.error('Status', status)
                console.error('Error', error)
                cb(error, undefined)
            }
        });
    } catch(ex) {
        console.log('Exception occurred while loading the gallery data', ex)
        cb(ex, undefined)
    }

}

renderGallery = function(id, galleryDetails) {
    const galleryItemTemplate = `<div class="col-sm-6 col-md-4 col-lg-3">
                                    <a href="<REPLACE_IMAGE_URL>">
                                        <img class="img-fluid"src="<REPLACE_IMAGE_URL>" alt="<REPLACE_IMAGE_DESC>">
                                    </a>
                                </div>`;
    var galleryHTML = []
    galleryDetails.forEach((imgDetails) => {
        var tmp = galleryItemTemplate.replaceAll("<REPLACE_IMAGE_URL>", imgDetails.image);
        tmp = tmp.replace("<REPLACE_IMAGE_DESC>", imgDetails.desc);
        galleryHTML.push(tmp)
    })
    $(id).html(galleryHTML.join(''))
    baguetteBox.run(id, {
        animation: "slideIn",
        captions: function(element) {
            if(element.getElementsByTagName('img').length > 0) {
                return element.getElementsByTagName('img')[0].alt;
            } else {
                return ''
            }
        }
    });              
}

saveContact = function() {

    const userContactDetails = {
        "first_name": "Test",
        "last_name": "Last name",
        "email": "test email@email.com",
        "mobile": "23492323",
        "address1": "Address 1",
        "address2": "",
        "city": "TEst City",
        "state": "My state",
        "country": "IN",
        "zip": "2342343",
        "query": "This is the query looking for"
    }
    saveContactAPI = $.ajax({
        type: "POST",
        url: SAVE_CONTACT_API_URL,
        data: JSON.stringify(userContactDetails),
        dataType: "application/json",
        success: function(resultData){
            console.log("Successfully saved the user contact.");
        },
        error: function(err) {
            console.log('Error occurred while saving the user contact')
        }
  });
}