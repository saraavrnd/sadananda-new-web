var app_url_prefix = `/sadananda-new-web`
// var app_url_prefix = ''
var load_results = {
    'banner' : 0,
    'initiative' : 0,
    'about_us' : 0
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

renderBanner = function(id, bannerdata) {
    const bannertemplate = `<div class="slide-container" >
			<img src="<REPLACE_IMAGE>">
            <div class="banner-content">
            <h2 class="banner-title"><REPLACE_HEADING></h2>
            <p class="banner-details"><REPLACE_SUBHEADING></p>
        </div>

		</div>`
    var bannerHTML = []
    bannerdata.forEach((banner) => {
        var tmp = bannertemplate.replace("<REPLACE_IMAGE>", banner.image);
        tmp = tmp.replace("<REPLACE_SUBHEADING>", banner.sub_heading);
        tmp = tmp.replace("<REPLACE_HEADING>", banner.heading);
        bannerHTML.push(tmp)
    })
    $(id).html(bannerHTML.join(''))
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
    const initiativetemplate = `<div class="initiative-slide-container" >
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
                            
                            </div>`
    var initiativeHTML = []
    initiatives.forEach((initiative) => {
        var tmp = initiativetemplate.replaceAll("<REPLACE_LINK>", initiative.link);
        tmp = tmp.replaceAll("<REPLACE_IMAGE>", initiative.image);
        tmp = tmp.replaceAll("<REPLACE_NAME>", initiative.name);
        tmp = tmp.replaceAll("<REPLACE_ID>", initiative.id);
        initiativeHTML.push(tmp)
    })
    $(id).html(initiativeHTML.join(''))

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
        scheme_ids.forEach((scheme_id) => {
            const scheme_details = schemes[scheme_id];
            var tmp = scheme_template.replaceAll("<REPLACE_IMAGE>", scheme_details.image);
            tmp = tmp.replaceAll("<REPLACE_SCHEME_ID>", scheme_details.id);
            tmp = tmp.replaceAll("<REPLACE_INITIATIVE_ID>", scheme_details.initiative_id);
            tmp = tmp.replaceAll("<REPLACE_SCHEME_NAME>", scheme_details.name);
            tmp = tmp.replaceAll("<REPLACE_SCHEME_DESCRIPTION>", scheme_details.description);
            schemeDetailsHTML.push(tmp)
        })
        $(id).html(schemeDetailsHTML.join(''));
    }
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