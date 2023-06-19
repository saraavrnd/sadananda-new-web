// var app_url_prefix = `/sadananda-new-web`
var app_url_prefix = ''
var GET_CONFIG_API_URL = `api/config`
var SAVE_CONTACT_API_URL = `api/saveContact`
var CREATE_PAYMENT_API_URL = `api/initiatePayment`
var COMPLETE_PAYMENT_API_URL = `api/completePayment`
const INSERT_SELECTED_SCHEME = `<input type="hidden" id="user_selected_scheme" value="<REPLACE_SELECTED_SCHEME>">`
const SELECTED_ICON_DISPLAY = `<i class="fa-solid fa-circle-check"></i>${INSERT_SELECTED_SCHEME}`
const BTN_LOADING_STATUS = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="false"></span> Loading Payment Options...`
var gl_about_us_data = undefined;
var gl_donation_payment_payload = undefined;

var paypal_script_src = `https://www.paypal.com/sdk/js?client-id=<REPLACE_CLIENT_ID>&components=buttons`
var paypal_subscription_script_src = `${paypal_script_src}&vault=true&intent=subscription`

const custom_donation_config = {
    id: -1,
    name: "Custom",
    desc: "You can choose any amount to be donated",
    image: "images/default/sadananda_homeview_custom_donate.png",
    currency: "USD"
}

const custom_initiatives = [
    // {
    //     name: "Future Projects",
    //     link: "future_projects.html"
    // }
]
var selected_initiative_donation = undefined;
var initiatives_loaded = undefined;
var selected_initiative_for_donation = undefined;
var selected_scheme_for_donation = undefined;
var selected_plan_id_for_subscription = undefined;
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
    const dataset = eval(page + "_BANNER_DATA")
    if(! dataset) {
        console.log('No data set is available now')
        cb(new Error("Data is not available"), undefined);
        return;
    } else {
        console.log('Available data set is:', dataset)
        cb(undefined, dataset)
    }
    
    // const url = `${app_url_prefix}/data/banner/${page}.json`
    // try {
    //     $.ajax({
    //         type: 'GET',
    //         url: url,
    //         success: (data)  => {
    //             console.log("Banner data:", data);
    //             // const lines = data.split('\n').filter((line) => {
    //             //     return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
    //             // })
    //             // // console.log('Lines', lines)
    //             // var banners = []
    //             // lines.forEach((line) => {
    //             //     const tokens = line.split('sub-heading=')
    //             //     if(tokens.length == 2) {
    //             //         const parts = tokens[0].split(',')
    //             //         const image = $.trim(parts[0].substr(parts[0].indexOf('image=')+6))
    //             //         const heading = $.trim(parts[1].substr(parts[1].indexOf('heading=')+8))
                        
    //             //         banners.push( {
    //             //             image: image,
    //             //             heading: heading,
    //             //             sub_heading: tokens[1]
    //             //         })
    //             //     }
    //             // })
    //             // console.log('Banners', banners)
    //             cb(undefined, data)
    //         },
    //         error: (request, status, error) => {
    //             console.error('Failed to get the banner data')
    //             console.error('Request', request)
    //             console.error('Status', status)
    //             console.error('Error', error)
    //             cb(error, undefined)
    //         }
    //     });
    // } catch(ex) {
    //     console.log('Exception occurred while loading the banners data', ex)
    //     cb(ex, undefined)
    // }
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
    const bannertemplate = `
        <div class="slide-container" >
			<!-- <div class="image" id="image-<REPLACE_BANNER_ID>"></div> -->
			<img src="<REPLACE_IMAGE>" />
            <div class="banner-content">
                <h2 class="banner-title"><REPLACE_HEADING></h2>
                <p class="banner-details"><REPLACE_SUBHEADING></p>
            </div>
		</div>`
    const eventbannertemplate = `
    <div class="slide-container" >
			<!-- <div class="image" id="image-<REPLACE_BANNER_ID>"></div> -->
			<img src="<REPLACE_IMAGE>" />
            <div class="banner-content">
                <h2 class="banner-title"><REPLACE_HEADING></h2>
                <p class="banner-details"><REPLACE_SUBHEADING></p>
            </div>
            <a href="javascript:open('<REPLACE_BOOK_NOW_LINK>', '_newwin');" 
                            class="events_book_now_btn
                            btn btn-primary btn-lg
                            " 

                >
                <!-- <img src="images/booknow-2.png" class="img-responsive" /> -->
                Book Now
            </a>
		</div>
    `
    var template = (id == "#events-banner") ? eventbannertemplate : bannertemplate
    var bannerHTML = []
    var index=1;
    bannerdata.forEach((banner) => {
        // var tmp = template.replace("<REPLACE_IMAGE>", updateImagePathAsperNormalizedImage(banner.image));
        var tmp = template.replace("<REPLACE_IMAGE>", banner.image);
        tmp = tmp.replace("<REPLACE_SUBHEADING>", banner.sub_heading);
        tmp = tmp.replace("<REPLACE_HEADING>", banner.heading);
        tmp = tmp.replace("<REPLACE_BANNER_ID>", index);
        var link = $.trim(banner.link)
        if(link.length > 0) {
            tmp = tmp.replace("<REPLACE_BOOK_NOW_LINK>", link);
        } else {
            tmp = tmp.replace("<REPLACE_BOOK_NOW_LINK>", "");
        }
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

    const dataset = eval("INITIATIVES_DATA")
    if(! dataset) {
        console.log('No data set is available now')
        cb(new Error("Data is not available"), undefined);
        return;
    } else {
        console.log('Initiatives Available data set is:', dataset)
        cb(undefined, dataset)
    }

    // const url = `${app_url_prefix}/data/initiatives/index.json`;
    // console.log('Loading initiatives from:', url)

    // try {
    //     $.ajax({
    //         type: 'GET',
    //         url: url,
    //         success: (data)  => {
    //             // console.log("Banner data:", data);
    //             // const lines = data.split('\n').filter((line) => {
    //             //     return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
    //             // })
    //             // // console.log('Lines', lines)
    //             // var initiatives = []
    //             // lines.forEach((line) => {
    //             //     if(line.indexOf('type=initiative') != -1) {
    //             //         const tokens = line.split(',')
    //             //         if(tokens.length == 5) {
                            
    //             //             initiatives.push( {
    //             //                 id: tokens[0].split('=')[1],
    //             //                 type: tokens[1].split('=')[1],
    //             //                 image: tokens[2].split('=')[1],
    //             //                 name: tokens[3].split('=')[1],
    //             //                 link: tokens[4].split('=')[1],
    //             //             })
    //             //         }
    //             //     } else if(line.indexOf('type=scheme') != -1) {
    //             //         const tokens = line.split(',')
    //             //         // id=scheme1,
    //             //         // type=scheme,
    //             //         // initiative_id=initiative1,
    //             //         // image=images/adopt_grandma_grandpa.jpg,
    //             //         // name=Adopt a Grandma / Grandpa,
    //             //         // minimum_donation=10,
    //             //         // currency=DOLLOR,
    //             //         // description=To meet basic needs of one grandma/grandpa for a month

    //             //         if(tokens.length >= 8) {
                            
    //             //             const initiative_id = tokens[2].split('=')[1]
    //             //             const scheme_details = {
    //             //                 id: tokens[0].split('=')[1],
    //             //                 type: tokens[1].split('=')[1],
    //             //                 initiative_id: initiative_id,
    //             //                 image: tokens[3].split('=')[1],
    //             //                 name: tokens[4].split('=')[1],
    //             //                 minimum_donation: tokens[5].split('=')[1],
    //             //                 currency: tokens[6].split('=')[1],
    //             //                 description: line.substr(line.indexOf('description=') + 12),
    //             //             }
    //             //             pushSchemeUnderInitiative(initiatives, initiative_id, scheme_details)
    //             //         }
    //             //     }
    //             // })
    //             console.log('Initiatives', data)
    //             cb(undefined, data)
    //         },
    //         error: (request, status, error) => {
    //             console.error('Failed to get the initiatives data')
    //             console.error('Request', request)
    //             console.error('Status', status)
    //             console.error('Error', error)
    //             cb(error, undefined)
    //         }
    //     });
    // } catch(ex) {
    //     console.log('Exception occurred while loading the initiatives data', ex)
    //     cb(ex, undefined)
    // }
}

renderInitiatives = function(id, menuid, initiatives, initiative_id) {
                

    //cache the initiatives for donation page
    initiatives_loaded = initiatives;

    const initiativetemplate = `<div class="carousel-item <REPLACE_ACTIVE> ">
                                        <div class="col-md-3 col-sm-12 ">
                                            <div class="initiative-slide-container" >
                                                <div class="card mb-3" >
                                                    <a href="<REPLACE_LINK>">
                                                        <img class="card-img-top" src="<REPLACE_IMAGE>" alt="<REPLACE_NAME>">
                                                    </a>
                                                    <div class="card-body">
                                                        <h5 class="card-title initiative-name"><REPLACE_NAME></h5>
                                                    </div>                                                        
                                                    <div class="card-footer text-center">
                                                        <a href="page-donate.html?initiative_id=<REPLACE_ID>" class="button">Donate Now</a>
                                                        <!-- <a href="<REPLACE_LINK>" class="button ">more...</a> -->
                                                    </div>
                                                </div>
                                            </div>	                                
                                        </div>
                                    </div>
                                `
                                
                                // "is_enabled_in_initiative_banner" : 1,
                                // "is_enabled_in_menu": 1
                        
    var initiativeHTML = []
    var index = 0;
    initiatives.forEach((initiative) => {
        if(initiative.is_enabled_in_initiative_banner == 1) {
            var tmp = initiativetemplate.replaceAll("<REPLACE_LINK>", initiative.link);
            tmp = tmp.replaceAll("<REPLACE_IMAGE>", initiative.image);
            tmp = tmp.replaceAll("<REPLACE_NAME>", initiative.name);
            tmp = tmp.replaceAll("<REPLACE_ID>", initiative.id);
            if(index == 0) {
                tmp = tmp.replaceAll("<REPLACE_ACTIVE>", "active");
            } else {
                tmp = tmp.replaceAll("<REPLACE_ACTIVE>", "");
            }
            initiativeHTML.push(tmp)
        }
        index++;
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

        if(initiative.is_enabled_in_menu == 1) {
            var tmp = initiatives_menu_template.replaceAll("<REPLACE_LINK>", initiative.link);
            tmp = tmp.replaceAll("<REPLACE_NAME>", initiative.name);
            initiativeMenuHTML.push(tmp)
        }
    })

    custom_initiatives.forEach((custom_initiative) => {
        var tmp = initiatives_menu_template.replaceAll("<REPLACE_LINK>", custom_initiative.link);
        tmp = tmp.replaceAll("<REPLACE_NAME>", custom_initiative.name);
        initiativeMenuHTML.push(tmp)
    })
    
    $(menuid).html(initiativeMenuHTML.join(''));

    var schemeDetailsHTML  = [];
    if(initiative_id != undefined && initiative_id.length > 0) {

        const scheme_template = `
                                <div class="carousel-item <REPLACE_ACTIVE>">
                                    <div class="col-md-3 col-sm-12">
                                        <div class="initiative-slide-container" >
                                            <div class="card mb-3" style="max-width: 18rem;">
                                                <img class="card-img-top" src="<REPLACE_IMAGE>" alt="<REPLACE_SCHEME_NAME>">
                                                <div class="card-body">
                                                    <h5 class="card-title scheme-name"><REPLACE_SCHEME_NAME></h5>
                                                </div>                                                        
                                                <div class="card-footer text-center">
                                                    <a href="page-donate.html?scheme_id=<REPLACE_SCHEME_ID>&initiative_id=<REPLACE_INITIATIVE_ID>" class="button">Donate Now</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `

                                
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

        //change the name here
        $('.initiative-head .page-title').text(selected_initiative_list[0].name)
    }

    initCarousel(id);
}	

loadAboutUs = function(cb) {

    const dataset = eval("ABOUT_US")
    if(! dataset) {
        console.log('No data set is available now')
        cb(new Error("Data is not available"), undefined);
        return;
    } else {

        //cache it to use for later.
        gl_about_us_data = dataset;

        console.log('About US Available data set is:', dataset)
        cb(undefined, dataset)
    }

    // const url = `${app_url_prefix}/data/about_us.json`;
    // console.log('Loading about us from:', url)

    // try {
    //     $.ajax({
    //         type: 'GET',
    //         url: url,
    //         success: (data)  => {
    //             // console.log("Banner data:", data);
    //             // const lines = data.split('\n').filter((line) => {
    //             //     return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
    //             // })
    //             // // console.log('Lines', lines)
    //             // var about_us = {}
    //             // lines.forEach((line) => {
    //             //     const index = line.indexOf('=')
    //             //     if(index != -1) {
                        
    //             //         const key = line.substring(0, index);
    //             //         const value = line.substring(index+1)
    //             //         about_us[key] = value
    //             //     }
    //             // })
    //             console.log('About', data)
    //             cb(undefined, data)
    //         },
    //         error: (request, status, error) => {
    //             console.error('Failed to get the about ius data')
    //             console.error('Request', request)
    //             console.error('Status', status)
    //             console.error('Error', error)
    //             cb(error, undefined)
    //         }
    //     });
    // } catch(ex) {
    //     console.log('Exception occurred while loading the about us data', ex)
    //     cb(ex, undefined)
    // }
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

    renderDonationTaxExemptionClass('.donation_tax_exemption_clause', 'DONATION_TAX_EXEMPTION_CLAUSE', about_us_data)
}

renderDonationTaxExemptionClass = function(id, key, about_us_data) {
    $(id).html(about_us_data[key])
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

    const dataset = eval("GALLERY_DATA")
    if(! dataset) {
        console.log('No data set is available now for gallery')
        cb(new Error("Gallery Data is not available"), undefined);
        return;
    } else {
        console.log('Gallery data set is:', dataset)
        cb(undefined, dataset)
    }

    // const url = `${app_url_prefix}/data/gallery.json`

    // try {
    //     $.ajax({
    //         type: 'GET',
    //         url: url,
    //         success: (data)  => {
    //             // console.log("Banner data:", data);
    //             // const lines = data.split('\n').filter((line) => {
    //             //     return $.trim(line).length > 0 && (! $.trim(line).startsWith('#'))
    //             // })
    //             // // console.log('Lines', lines)
    //             // var gallery = []
    //             // lines.forEach((line) => {
    //             //     const tokens = line.split(',')
    //             //     if(tokens.length >= 2) {

    //             //         const desc = $.trim(line.substr(line.indexOf(',')+6))
                        
    //             //         gallery.push( {
    //             //             image: $.trim(tokens[0].substr(tokens[0].indexOf("=") + 1)),
    //             //             desc: desc,
    //             //         })
    //             //     }
    //             // })
    //             // console.log('Gallery Details', gallery)
    //             cb(undefined, data)
    //         },
    //         error: (request, status, error) => {
    //             console.error('Failed to get the gallery data')
    //             console.error('Request', request)
    //             console.error('Status', status)
    //             console.error('Error', error)
    //             cb(error, undefined)
    //         }
    //     });
    // } catch(ex) {
    //     console.log('Exception occurred while loading the gallery data', ex)
    //     cb(ex, undefined)
    // }

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

resetContactError = function(msg) {
    $('#anyContactError').text(msg);
}

saveContact = function() {

    resetContactError('')
    const firstname = $.trim($('#contact_firstname').val());
    const lastname = $.trim($('#contact_lastname').val());
    const email = $.trim($('#contact_email_customer').val());
    const message = $.trim($('#contact_message').val());
    if(firstname.length <= 0) {
        console.log('First name is empty in contacts section');
        resetContactError('First name cannot be empty')
        $('#contact_firstname').focus();
        return;
    }
    if(email.length <= 0) {
        console.log('Email address cannot be empty');
        resetContactError('Email address cannot be empty')
        $('#contact_email_customer').focus();
        return;
    }
    if(message.length <= 0) {
        console.log('Contact message cannot be empty');
        resetContactError('Please share a message...')
        $('#contact_message').focus();
        return;
    }

    const userContactDetails = {
        "first_name": firstname,
        "last_name": lastname,
        "email": email,
        "message": message,
        "requested_datetime" : new Date()
    }

    $(document).ajaxStart(function(){
        // $("#contact_save_status").css("display", "block");
        resetContactError("Saving your message...")        
    });

    $(document).ajaxComplete(function(){
        // setTimeout(() => {
        //     $("#contact_save_status").css("display", "none");
        // }, 10000)
        resetContactError("Thanks for contacting us. We will get back to you as soon as possible.")        
    });
    try {
        saveContactAPI = $.ajax({
            type: "POST",
            url: SAVE_CONTACT_API_URL,
            data: JSON.stringify(userContactDetails),
            dataType: "application/json",
            crossDomain: true,
            // dataType: 'jsonp',
            success: function(resultData){
                console.log("Successfully saved the user contact.");
            },
            error: function(err) {
                console.log('Error occurred while saving the user contact')
            },
        });
    } catch(ex) {

    }
}

handlePaymentResponse = function(details)  {
    $('#donation_confirmation_dialog').modal('hide')

    if(details == undefined || details.txn_results == undefined) {
        var donation_results_pretext = `<span class="badge bg-danger">Something went wrong while doing payment. Please try again later. </span>`;
        if(gl_about_us_data['DONATION_FAILURE_TEXT']) {
            donation_results_pretext = gl_about_us_data['DONATION_FAILURE_TEXT'];
        }
        $('#donation_results_dialog #donationResultsTitle').html('<span class="badge bg-danger">Donation unsuccessful</span>')
        $('#donation_results_text').html(donation_results_pretext)
        $('#donation_results_dialog').modal('show')
        return;
    }

    var donation_results_pretext = `Thanks <REPLACE_FIRST_NAME>, for your donation. 
                                        <REPLACE_DONATION_RESULTS>`;
    if(gl_about_us_data['DONATION_RESULTS_TEXT']) {
        donation_results_pretext = gl_about_us_data['DONATION_RESULTS_TEXT']
    }
    var first_name = "";
    if(details != undefined && details.txn_results != undefined) {
        first_name = details.txn_results.payer.name.given_name
    }
    donation_results_pretext = donation_results_pretext.replace('<REPLACE_FIRST_NAME>', first_name);
    donation_results_pretext = donation_results_pretext.replace('<REPLACE_CONTACT_NAME>', gl_about_us_data['DONATION_CONTACT_NAME']);
    donation_results_pretext = donation_results_pretext.replace('<REPLACE_INITIATIVE_NAME>', gl_donation_payment_payload['initiative']);
    $('#donation_results_dialog #donationResultsTitle').html('Donation Success !!')
    $('#donation_results_text').html(donation_results_pretext)
    $('#donation_results_dialog').modal('show')
    
}

getEnvConfig = function(cb) {
    
    const url = `${GET_CONFIG_API_URL}`

    try {
        $.ajax({
            type: 'GET',
            url: url,
            success: (data)  => {
                console.log("Configuation is:", data);
                cb(undefined, data)
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
        console.log('Exception occurred while loading the configuration data', ex)
        cb(ex, undefined)
    }

}

loadPaypalPaymentOptions = async function() {

    getEnvConfig((err, config) => {
        if(err) {
            console.log('Failed to get the env configuration');
            return;
        }

        const clientID = config.client_id
        const script_src = paypal_script_src.replaceAll('<REPLACE_CLIENT_ID>', clientID)
        
        console.log(`Script to load:${script_src}`)

        var scriptNode = document.createElement('script');
        scriptNode.src = script_src
        scriptNode.addEventListener('load', () => {

            console.log('Script paypal node has been added...')

            paypal.Buttons({
                onInit(data, actions)  {
                    console.log('On Init is called with data', data);
                    console.log('on Init is calld with actions', actions);
                },
                onClick()  {
                },
                onCancel(data) {
                    console.log('User has cancelled the payment transaction. Data is', data);
                    return;
                },
                createOrder() {
                    console.log('Order id is called now')
                    try {
                        return fetch(`${CREATE_PAYMENT_API_URL}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(gl_donation_payment_payload)
                        })
                        .then((response) => response.json())
                        .then((order) => order.id);
                    } catch(ex) {
                        console.log('Payment initiation failed. Error:' + ex)
                    }
                },
                onApprove(data) {
                    console.log('On Approval data is', data);
                    return fetch(`${COMPLETE_PAYMENT_API_URL}`, {
                            method: "POST",
                            body: JSON.stringify({
                                id: data.orderID
                            })
                    })
                    .then((response) => response.json())
                    .then((details) => {
                        console.log('Transaction details', details)
                        // This function shows a transaction success message to your buyer.
                        // alert('Transaction completed by ' + details.payer.name.given_name);
                        handlePaymentResponse(details)
                    });
                },
                style: {
                    layout: 'horizontal',
                    color:  'gold',
                    shape:  'rect',
                    label:  'paypal'
                }
            }).render('#payment_container');
    
        });
        document.body.appendChild(scriptNode);
    });
}



getSchemesForGivenInitiative = function(initiativeID) {
    var selected_initiative = initiatives_loaded.filter((initiative) => initiative.id == initiativeID);
    if(selected_initiative.length <= 0){
        return [];
    }
    return selected_initiative[0].schemes;
}

getCustomDonationOption = function(template, schemeNumber) {

    const schemeTemplate = ` <!-- offset-md-1 -->
    <div class="col-sm-12 col-md-2 col-lg-2 <REPLACE_OFFSET>">
        <div id="custom_donation_card" class="card text-white bg-secondary mb-3" style="max-width: 18rem;" name="<REPLACE_SCHEME_ID>">
            <!-- <div class="card-header"><REPLACE_NUMBER></div> -->
            <img class="card-img-top" src="<REPLACE_SCHEME_IMAGE>" alt="<REPLACE_SCHEME_NAME>">
            <div class="card-body">
                <h5 class="card-title"><REPLACE_SCHEME_NAME></h5>
                <label class="sr-only" for="custom_donation_amount">Donation Amount: </label>
                <div class="input-group mb-2">
                    <div class="input-group-prepend">
                    <div class="input-group-text"><REPLACE_DONATION_CURRENCY></div>
                    </div>
                    <input 
                        onBlur="formatCurrency(event, this, 'blur');"
                        onkeyup="formatCurrency(event, this);" 
                        type="text" class="form-control" id="custom_donation_amount" placeholder="">
                </div>
            </div>
            <div class="card-footer text-center">
                 <span>
                    <REPLACE_DEFAULT_SELECTED>
                </span>
            </div>
        </div>		
    </div>
    `

    var option = schemeTemplate.replace("<REPLACE_SCHEME_ID>", custom_donation_config.id);
    option = option.replace("<REPLACE_NUMBER>", `Scheme: ${schemeNumber}`);

    option = option.replace("<REPLACE_OFFSET>", "");
    option = option.replace("<REPLACE_SCHEME_IMAGE>", custom_donation_config.image);
    option = option.replace("<REPLACE_DEFAULT_SELECTED>", "&nbsp;");
    option = option.replaceAll("<REPLACE_DONATION_CURRENCY>", custom_donation_config.currency);
    option = option.replaceAll("<REPLACE_SCHEME_NAME>", custom_donation_config.name);
    return option;    
}

selectSchemeById = function(scheme_id) {
    console.log('CLicking the scheme by id:' + scheme_id)

    if(scheme_id == undefined) {
        //may no schemes, initiatives selected in this page via URL. select the first one.
        const donation_cards = $(`#donation-section .card`);
        if(donation_cards.length > 0) {
            donation_cards[0].click();
        } else {
            console.log('No donation cards are avaiable')
        }
        return;
    }
    $(`#donation-section .card[name="${scheme_id}"]`).click();
}


function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(event, input, blur) {

    // console.log('key:', event.key)
    // console.log('key code:', event.code)
    if(! input) {
        return;
    }
    var input_val = input.value;
    // don't validate empty input
    if (input_val === "") {
        return;
    }

    // original length
    var original_len = input_val.length;

    // initial caret position
    var caret_pos = input.selectionStart;

    // check for decimal
    if (input_val.indexOf(".") >= 0) {
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = left_side + "." + right_side;
    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val = input_val;

        // final formatting
        if (blur === "blur") {
            input_val += ".00";
        }
    }

    // send updated string to input
    input.value = input_val;

    //following 2 lines, updated by Lister team to resolve the invalid donation amount when comma is present
    let valueWithoutComma = parseFloat(input_val.replace(/,/g, ""));

    $('#donation-section #selected_donation_amount').val(valueWithoutComma);

    // put caret back in the right position
    // var updated_len = input_val.length;
    // caret_pos = updated_len - original_len + caret_pos;
    // input.setSelectionRange(caret_pos, caret_pos);


}


addCardClickListeners = function() {
    $('.card').on('click', (e) => {
        console.log('Target', e.currentTarget)
        $('#donation-section .card .card-footer span').html("&nbsp;")
        $(e.currentTarget).find(".card-footer span").html(SELECTED_ICON_DISPLAY);
        const selected_scheme = $.trim($(e.currentTarget).attr("name"));
        if(selected_scheme == "-1") {
            //custom option is selected
            //bring the textinput focus
            $(e.currentTarget).find('input').focus();
            $('#donation-section #selected_donation_amount').val($(e.currentTarget).find('input').val());

        }
        $(e.currentTarget).find(".card-footer span input").val(selected_scheme);
    
        //reset the selected donation
        const selected_scheme_by_user  = getSelectedSchemeDetails();
        if(selected_scheme_by_user != undefined) {
            $('#donation-section #selected_donation_amount').val(selected_scheme_by_user.minimum_donation);
        }
    });
    $('#donation-section .card[name=-1]').find("input").keyup(function() {
        const value = $(this).val();
        // const value = $('#donation-section .card[name=-1]').find("input").val();
        $('#donation-section #selected_donation_amount').val(value);
    })

}
loadSchemesBasedOnSelectedInitiative = function() {

    const schemeTemplate = ` <!-- offset-md-1 -->
                            <div class="col-sm-12 col-md-2 col-lg-2 <REPLACE_OFFSET>">
                                <div class="card text-white bg-secondary mb-3" style="max-width: 18rem;" name="<REPLACE_SCHEME_ID>">
                                    <!-- <div class="card-header"><REPLACE_NUMBER></div> -->
                                    <img class="card-img-top" src="<REPLACE_SCHEME_IMAGE>" alt="<REPLACE_SCHEME_NAME>">
                                    <div class="card-body">
                                        <h5 class="card-title"><REPLACE_SCHEME_NAME></h5>
                                        <p class="card-text">
                                            Donation Amount: 
                                            <span class="badge badge-light">
                                                <REPLACE_SCHEME_DONATION_AMOUNT>
                                            </span>
                                            <REPLACE_DONATION_CURRENCY>
                                        </p>
                                    </div>
                                    <div class="card-footer text-center">
                                         <span>
                                            <REPLACE_DEFAULT_SELECTED>
                                        </span>
                                    </div>
                                </div>		
                            </div>
                            `
    $('#select_scheme').empty();

    var selected_initiative = $.trim($('#select_initiatives').selectpicker('val'));
    if(selected_initiative.length <= 0) {
        return;
    }
    var selected_schemes = getSchemesForGivenInitiative(selected_initiative)
    var options = [];
    var index = 0;

    selected_schemes.forEach((scheme) => {
    
        var option = schemeTemplate.replace("<REPLACE_SCHEME_ID>", scheme.id);

        option = option.replace("<REPLACE_NUMBER>", `Scheme: ${index+1}`);
        
        if(index == 0) {
            option = option.replace("<REPLACE_OFFSET>", "offset-md-1");
            option = option.replace("<REPLACE_DEFAULT_SELECTED>", SELECTED_ICON_DISPLAY);
        }  else {
            option = option.replace("<REPLACE_OFFSET>", "");
            option = option.replace("<REPLACE_DEFAULT_SELECTED>", "&nbsp;");
        }
        option = option.replaceAll("<REPLACE_SCHEME_NAME>", scheme.name);
        option = option.replaceAll("<REPLACE_SCHEME_IMAGE>", scheme.image);
        option = option.replace("<REPLACE_SCHEME_DONATION_AMOUNT>", scheme.minimum_donation);
        option = option.replaceAll("<REPLACE_DONATION_CURRENCY>", scheme.currency);
        
        options.push(option);
        index++;
    })

    options.push(getCustomDonationOption(schemeTemplate, options.length + 1));
    // console.log('List of schemes', options)
    // $('#select_scheme').html(options.join(''));
    // $('#select_scheme').selectpicker('refresh');
    // $('#select_scheme').trigger('change')

    $("#select_scheme").html(options.join(''));

    addCardClickListeners();

    const selected_data = getSelectedInitiativeFromURL();
    if(selected_data.scheme_id != undefined && selected_data.initiative_id != undefined) {
        const selected_scheme_id = selected_data.scheme_id
        selectSchemeById(selected_scheme_id)    
    } else {
        //select the first one by default
        console.log('No initiative/scheme details present in URL. Selecting the first one')
        const donation_cards = $(`#donation-section .card`);
        if(donation_cards.length > 0) {
            donation_cards[0].click();
        } else {
            console.log('No donation cards are avaiable')
        }
    }

    const selected_scheme_by_user  = getSelectedSchemeDetails();
    if(selected_scheme_by_user != undefined) {
        $('#donation-section #selected_donation_amount').val(selected_scheme_by_user.minimum_donation);
    }   
}

getSelectedInitiativeDetails = function() {
    const name = $('#select_initiatives option:selected').text();

    var selected_initiative = initiatives_loaded.filter((initiative) => initiative.name == name )
    // var selected_initiative_details = options.filter((option) => {
    //     return $(option).text()
    // })
    // console.log('Selected initiative is:', selected_initiative_details );
    if(selected_initiative == undefined || selected_initiative.length <= 0) {
        return undefined;
    }
    return selected_initiative[0]
}

getSelectedSchemeDetails = function() {

    const selected_initiative_id = $.trim($("#select_initiatives").selectpicker('val'));
    if(selected_initiative_id.length <= 0) {
        return undefined;
    }
    var schemes = getSchemesForGivenInitiative(selected_initiative_id);
    if(schemes == undefined) {
        console.log('Schemes for the selected initiative is empty')
        return undefined;
    }
    //getSelected Scheme id
    const user_selected_scheme_id = $.trim($('#user_selected_scheme').val());
    if(user_selected_scheme_id.length <= 0) {
        console.log('User selected scheme id not found')
        return undefined;
    }
    console.log('Selected scheme id', user_selected_scheme_id)
    const selected_scheme = schemes.filter((scheme) => scheme.id == user_selected_scheme_id)
    if(selected_scheme.length <= 0) {
        console.log('Selected scheme is found to be empty')
        return undefined;
    }
    return selected_scheme[0]
}

getSelectedInitiativeFromURL = function() {
    const urlParams = new URLSearchParams(location.search);
    return {
        initiative_id: urlParams.get("initiative_id"),
        scheme_id: urlParams.get("scheme_id")
    }
}

populateInitiativeSchemesForDonation = function() {
    console.log('Initiatives to be loaded', initiatives_loaded)
    var options = [];
    var index = 0;

    const selected_data = getSelectedInitiativeFromURL();
    const selected_scheme_id = selected_data.scheme_id
    const selected_initiative_id = selected_data.initiative_id

    initiatives_loaded.forEach((initiative) => {
    
        var option = `<option value="${initiative.id}"` 
        if(initiative.id == selected_initiative_id) {
            option += " selected "
        }
        // option += ` data-thumbnail="${updateImagePathAsperNormalizedImage(initiative.image)}" `
        option += `>${initiative.name}</option>`
        
        options.push(option);
        index++;
    })
    // $('#select_initiatives').html(options.join(''));
    // $('#select_initiatives').selectpicker('refresh');
    $("#select_initiatives").selectpicker('refresh').empty().append(options.join('')).selectpicker('refresh').trigger('change');

    loadSchemesBasedOnSelectedInitiative();
}

resetDonateError = function(msg) {
    $('#anyDonateError').text(msg);
}

enableDonationBtnLoadingStatus = function(status) {
    if(status) {
        $('#btnDonate').html(BTN_LOADING_STATUS);
    } else {
        $('#btnDonate').html("Donate");
    }
}

initiateDonateNow = function() {

    gl_donation_payment_payload = undefined;

    resetDonateError('')
    var total_donation_amount = $.trim($('#selected_donation_amount').val());
    const donor_first_name = $.trim($('#donate_contact_firstname').val());
    const donor_last_name = $.trim($('#donate_contact_lastname').val());
    const donor_email = $.trim($('#donate_contact_email_customer').val());
    const donor_phone = $.trim($('#donate_contact_phone_customer').val());
    const donor_address = $.trim($('#donate_contact_address_customer').val());
    const donor_zip = $.trim($('#donate_contact_zip_customer').val());
    const heardusfrom= $.trim($('input[name="howdiduhearus"]:checked').val())
    const contact_donor_on_future_initiatives = $('#connect_with_donor_on_future_initiatives').prop('checked');

    if(total_donation_amount.length <= 0) {
        resetDonateError('Donation amount found to be invalid');
        $('#selected_donation_amount').focus();
        return;
    }
    if(isNaN(total_donation_amount)) {
        resetDonateError('Donation amount found to be invalid');
        $('#selected_donation_amount').focus();
        return;
    }

    if(donor_first_name.length <= 0) {
        resetDonateError('Your name cannot be empty');
        $('#donate_contact_firstname').focus();
        return;
    }
    if(donor_email.length <= 0) {
        resetDonateError('Your email cannot be empty');
        $('#donate_contact_email_customer').focus();
        return;
    }
    

    const recurring_donation = $('#recurring_donation_enabled').prop('checked');
    console.log('REcurring donation enabled', recurring_donation)

    if(recurring_donation) {
        total_donation_amount = Math.floor(total_donation_amount) 
    }

    var donation_confirmation_pretext = `Dear <REPLACE_FIRST_NAME>, <br/> Thank you for your generous contribution as donation towards Sadananada <REPLACE_DONATION_FREQUENCY>`;
    if(gl_about_us_data['DONATION_CONFIRMATION_TEXT']) {
        donation_confirmation_pretext = gl_about_us_data['DONATION_CONFIRMATION_TEXT']
    }
    donation_confirmation_pretext = donation_confirmation_pretext.replace('<REPLACE_FIRST_NAME>', donor_first_name);

    var donation_amount_freq_template = `
                                        <div class="row">
                                            <div class="col-lg-3 col-md-6 col-sm-12">
                                                Selected Initiative
                                            </div>
                                            <div class="col-lg-9 col-md-6 col-sm-12">
                                                <span class="badge bg-secondary"><REPLACE_DONATION_INITIATIVE> -> <REPLACE_DONATION_SCHEME></span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3 col-md-6 col-sm-12">
                                                Donation Amount
                                            </div>
                                            <div class="col-lg-9 col-md-6 col-sm-12">
                                                <span class="badge bg-success"><REPLACE_DONATION_AMOUNT> <REPLACE_DONATION_CURRENCY></span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-3 col-md-6 col-sm-12">
                                                Donation Frequency
                                            </div>
                                            <div class="col-lg-9 col-md-6 col-sm-12">
                                                <span class="badge bg-primary"><REPLACE_DONATION_FREQUENCY></span>
                                            </div>
                                        </div>
                                        `
    var donation_freq = "Once"
    if(recurring_donation) {
        donation_freq = "Every Month"
    }
    var donation_details = donation_amount_freq_template.replace("<REPLACE_DONATION_AMOUNT>", total_donation_amount);
    donation_details =  donation_details.replace("<REPLACE_DONATION_FREQUENCY>", donation_freq)
    donation_confirmation_pretext = donation_confirmation_pretext.replace("<REPLACE_DONATION_DATA>", donation_details);
    
    selected_initiative_for_donation = getSelectedInitiativeDetails();
    if(selected_initiative_for_donation == undefined) {
        resetDonateError('Something went wrong while processing the initiatives');
        return;
    }
    selected_scheme_for_donation = getSelectedSchemeDetails();
    if(selected_scheme_for_donation == undefined) {
        selected_scheme_for_donation = custom_donation_config;
    }
    console.log('Selected scheme in payment is:', selected_scheme_for_donation)
    console.log('Selected Initiative is:', selected_initiative_for_donation.name)

    donation_confirmation_pretext = donation_confirmation_pretext.replace("<REPLACE_DONATION_INITIATIVE>", selected_initiative_for_donation.name);
    donation_confirmation_pretext = donation_confirmation_pretext.replace("<REPLACE_DONATION_SCHEME>", selected_scheme_for_donation.name);
    donation_confirmation_pretext = donation_confirmation_pretext.replace("<REPLACE_DONATION_CURRENCY>", selected_scheme_for_donation.currency);

    $('#donation_confirmation_text').html(donation_confirmation_pretext)

    selected_plan_id_for_subscription = selected_initiative_for_donation.subscription_plan_id;

    gl_donation_payment_payload = {
        "first_name": donor_first_name,
        "last_name": donor_last_name,
        "donation_amount": total_donation_amount,
        "currency": selected_scheme_for_donation.currency,
        "email": donor_email,
        "phone": donor_phone,
        "address": donor_address,
        "zip": donor_zip,
        "heardusfrom":  heardusfrom,
        "contact_donor_on_future_initiatives" : contact_donor_on_future_initiatives,
        "donation_frequency" : donation_freq,
        "subscription_plan_id": selected_plan_id_for_subscription,
        "initiative" : selected_initiative_for_donation.name,
        "scheme" : selected_scheme_for_donation.name,
        "donation_initiated_at" : new Date()
    }
    console.log('Initiating donation with:', gl_donation_payment_payload)
    
    enableDonationBtnLoadingStatus(true)

    getEnvConfig((err, config) => {
        if(err) {
            console.log('Failed to get the env configuration');
            resetDonateError('Something went wrong while processing the donation. Pls try again later.');
            enableDonationBtnLoadingStatus(false)
            return;
        }
        const clientID = config.client_id

        var script_src = recurring_donation ? paypal_subscription_script_src : paypal_script_src
        script_src = script_src.replaceAll('<REPLACE_CLIENT_ID>', clientID)
        console.log(`Script to load:${script_src}`)

        //Delete any script node if any
        $('#paypalIDNode').remove();

        var scriptNode = document.createElement('script');
        scriptNode.src = script_src
        scriptNode.id = "paypalIDNode"
        if(recurring_donation) {
            scriptNode.addEventListener('load', () => {
                console.log('Script paypal node has been added for subscription...')
                paypal.Buttons({
                    onInit(data, actions)  {
                        console.log('On Init is called with data', data);
                        console.log('on Init is calld with actions', actions);
                        enableDonationBtnLoadingStatus(false)
                        $('#donation_confirmation_dialog').modal('show')
                    },
                    onClick()  {
                    },
                    onCancel(data) {
                        console.log('User has cancelled the payment transaction. Data is', data);
                        handlePaymentResponse(undefined);
                        return;
                    },
                    createSubscription: function(data, actions) {
                        console.log('Create subscription is called now for plan id:' + selected_plan_id_for_subscription)
                        return actions.subscription.create({
                            "plan_id": selected_plan_id_for_subscription, // Creates the subscription
                            "quantity": total_donation_amount
                        });
                    },
                    onApprove(data) {
                        console.log('On Approval data is', data);
                        return fetch(`${COMPLETE_PAYMENT_API_URL}`, {
                                method: "POST",
                                body: JSON.stringify({
                                    id: data.orderID
                                })
                        })
                        .then((response) => response.json())
                        .then((details) => {
                            console.log('Transaction details', details)
                            // This function shows a transaction success message to your buyer.
                            // alert('Transaction completed by ' + details.payer.name.given_name);
                            handlePaymentResponse(details)
                        });
                    },
                    style: {
                        layout: 'horizontal',
                        color:  'gold',
                        shape:  'rect',
                        label:  'paypal'
                    }
                }).render('#payment_container');
        
            });
        } else {
            scriptNode.addEventListener('load', () => {
                console.log('Script paypal node has been added for default...')
                paypal.Buttons({
                    onInit(data, actions)  {
                        console.log('On Init is called with data', data);
                        console.log('on Init is calld with actions', actions);
                        enableDonationBtnLoadingStatus(false)
                        $('#donation_confirmation_dialog').modal('show')
                    },
                    onClick()  {
                    },
                    onCancel(data) {
                        console.log('User has cancelled the payment transaction. Data is', data);
                        handlePaymentResponse(undefined);
                        return;
                    },
                    createOrder() {
                        console.log('Order id is called now')
                        try {
                            return fetch(`${CREATE_PAYMENT_API_URL}`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(gl_donation_payment_payload)
                            })
                            .then((response) => response.json())
                            .then((order) => order.id);
                        } catch(ex) {
                            console.log('Payment initiation failed. Error:' + ex)
                        }
                    },
                    onApprove(data) {
                        console.log('On Approval data is', data);
                        return fetch(`${COMPLETE_PAYMENT_API_URL}`, {
                                method: "POST",
                                body: JSON.stringify({
                                    id: data.orderID
                                })
                        })
                        .then((response) => response.json())
                        .then((details) => {
                            console.log('Transaction details', details)
                            // This function shows a transaction success message to your buyer.
                            // alert('Transaction completed by ' + details.payer.name.given_name);
                            handlePaymentResponse(details)
                        });
                    },
                    style: {
                        layout: 'horizontal',
                        color:  'gold',
                        shape:  'rect',
                        label:  'paypal'
                    }
                }).render('#payment_container');
            });
        }
        document.body.appendChild(scriptNode);
    });
}
