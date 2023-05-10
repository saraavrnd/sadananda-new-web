var app_url_prefix = `/sadananda-new-web`
// var app_url_prefix = ''
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
                    const tokens = line.split(',')
                    if(tokens.length == 4) {
                        
                        initiatives.push( {
                            id: tokens[0].split('=')[1],
                            image: tokens[1].split('=')[1],
                            name: tokens[2].split('=')[1],
                            link: tokens[3].split('=')[1],
                        })
                    }
                })
                console.log('Banners', initiatives)
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
        
    }
}

renderInitiatives = function(id, menuid, initiatives) {
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
}	
