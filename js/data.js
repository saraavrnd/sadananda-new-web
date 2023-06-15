const index_BANNER_DATA = [
    {
        "image": "images/default/Slide-1-Sadananda-homeview.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-2-Home.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-3-Home.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-4-Home.png",
        "heading": "",
        "sub_heading": ""
    }
]

const educationalassistance_BANNER_DATA = [
    {
        "image": "images/default/Slide-1-Education.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-2-Education.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-3-Education.png",
        "heading": "",
        "sub_heading": ""
    }
]

const freehomeforseniorcitizen_BANNER_DATA = [
    {
        "image": "images/default/Slide-1-Elders.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-2-Elders.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-3-Elders.png",
        "heading": "",
        "sub_heading": ""
    }
]

const freemedicalcare_BANNER_DATA = [
    {
        "image": "images/default/Slide-1-Medical.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-2-Medical.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-3-Medical.png",
        "heading": "",
        "sub_heading": ""
    }
]

const learningcenterforsplchildren_BANNER_DATA = [
    {
        "image": "images/default/Slide-1-Special-school.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-2-Special-school.png",
        "heading": "",
        "sub_heading": ""
    },
    {
        "image": "images/default/Slide-3-Special-school.png",
        "heading": "",
        "sub_heading": ""
    }
]


const INITIATIVES_DATA = [
    {
        "id": "initiative1",
        "type": "initiative",
        "image": "images/homeforsenior_schemes/Thumbnail_resized_1.png",
        "name": "Home for Senior Citizens",
        "link": "free_home_for_senior_citizens.html",
        "subscription_plan_id" : "P-5Y914095092784943MR7WPEQ",
        "schemes" : [
            {
                "id": "scheme1",
                "type": "scheme",
                "initiative_id": "initiative1",
                "image": "images/homeforsenior_schemes/Thumbnail_resized_1.png",
                "name": "ADOPT A GRAND PARENT FOR A MONTH",
                "minimum_donation": 50,
                "currency": "USD",
                "description":"To meet basic needs of one grandma/grandpa for a month"
            },
            {
                "id": "scheme3",
                "type": "scheme",
                "initiative_id": "initiative1",
                "image": "images/homeforsenior_schemes/Thumbnail_resized_4.png",
                "name": "ANNADANAM FOR 110 ELDERS ON A SPECIAL DAY",
                "minimum_donation": 125,
                "currency": "USD",
                "description":"Food expenses for one day for the 110 elders"
            },
            {
                "id": "scheme4",
                "type": "scheme",
                "initiative_id": "initiative1",
                "image": "images/homeforsenior_schemes/Thumbnail_resized_2.png",
                "name": "CORPUS - 1 DAY ANNADANAM FOR 110 ELDERS EVERY YEAR",
                "minimum_donation": 2100,
                "currency": "USD",
                "description":"Proceeds from this one time donation will be used to sponsor food for all the elders of the home on one day of your choice every year"
            },
            {
                "id": "scheme2",
                "type": "scheme",
                "initiative_id": "initiative1",
                "image": "images/homeforsenior_schemes/Thumbnail_resized_3.png",
                "name": "CORPUS - ADOPT A GRAND PARENT",
                "minimum_donation": 11100,
                "currency": "USD",
                "description":"Food expenses for one meal for the 110 elders"
            }
        ],
        "is_enabled_in_initiative_banner" : 1,
        "is_enabled_in_menu": 1
    },
    {
        "id": "initiative2",
        "type": "initiative",
        "image": "images/educare_schemes/thumbnail_resize-05.png",
        "name": "Education Centre",
        "link": "educational_assistance.html",
        "subscription_plan_id" : "P-5Y914095092784943MR7WPEQ",
        "schemes" : [
            {
                "id": "scheme5",
                "type": "scheme",
                "initiative_id": "initiative2",
                "image": "images/educare_schemes/thumbnail_resize-05.png",
                "name": "MONTHLY EDUCATION FOR ONE STUDENT",
                "minimum_donation": 20,
                "currency": "USD",
                "description":"To provide two sets of uniform or one set of new diwali dress for one student per year"
            },
            {
                "id": "scheme6",
                "type": "scheme",
                "initiative_id": "initiative2",
                "image": "images/educare_schemes/thumbnail_resize-04.png",
                "name": "MONTHLY REFRESHMENT FOR 270 STUDENTS",
                "minimum_donation": 415,
                "currency": "USD",
                "description":"To provide refreshments for one day for all the students"
            },
            {
                "id": "scheme7",
                "type": "scheme",
                "initiative_id": "initiative2",
                "image": "images/educare_schemes/thumbnail_resize-06.png",
                "name": "CORPUS - YEARLY EDUCATION FOR ONE SCHOOL STUDENT",
                "minimum_donation": 3700,
                "currency": "USD",
                "description":"To support school educational expenses for one student per year"
            },
            {
                "id": "scheme8",
                "type": "scheme",
                "initiative_id": "initiative2",
                "image": "images/educare_schemes/thumbnail_resize-07.png",
                "name": "SPONSOR DRESS FOR 270 STUDENTS FOR A YEAR",
                "minimum_donation": 6250,
                "currency": "USD",
                "description":"To support college educational expenses for one student per year"
            }
        ],
        "is_enabled_in_initiative_banner" : 1,
        "is_enabled_in_menu": 1
    },
    {
        "id": "initiative3",
        "type": "initiative",
        "image": "images/medcare_schemes/Thumbnail_resized_1.png",
        "name": "Medical Care",
        "link": "free_medical_care_center.html",
        "subscription_plan_id" : "P-5Y914095092784943MR7WPEQ",
        "schemes" : [
            {
                "id": "scheme9",
                "type": "scheme",
                "initiative_id": "initiative3",
                "image": "images/medcare_schemes/Thumbnail_resized_1.png",
                "name": "MONTHLY MEDICINES FOR 10 PATIENTS",
                "minimum_donation": 20,
                "currency": "USD",
                "description":"Support expenses for the medical centre for half a day"
            },
            {
                "id": "scheme10",
                "type": "scheme",
                "initiative_id": "initiative3",
                "image": "images/medcare_schemes/Thumbnail_resized_2.png",
                "name": "MONTHLY SUPPORT 10 PATIENTS",
                "minimum_donation": 50,
                "currency": "USD",
                "description":"Support expenses for the medical centre for one day"
            },
            {
                "id": "scheme11",
                "type": "scheme",
                "initiative_id": "initiative3",
                "image": "images/medcare_schemes/Thumbnail_resized_3.png",
                "name": "CORPUS - YEARLY SUPPORT FOR 1 PATIENT",
                "minimum_donation": 1100,
                "currency": "USD",
                "description":"Support expenses for one medical camp"
            },
            {
                "id": "scheme12",
                "type": "scheme",
                "initiative_id": "initiative3",
                "image": "images/medcare_schemes/Thumbnail_resized_4.png",
                "name": "CORPUS - YEARLY SUPPORT 10 PATIENTS",
                "minimum_donation": 11000,
                "currency": "USD",
                "description":"Proceeds from this one time donation will be used for meeting the expenses for one day (of your choice) in a year"
            }
        ],
        "is_enabled_in_initiative_banner" : 1,
        "is_enabled_in_menu": 1
    },
    {
        "id": "initiative4",
        "type": "initiative",
        "image": "images/splschool_schemes/thumbnail_resize-19.png",
        "name": "Special School",
        "link": "learning_center_for_special_children.html",
        "subscription_plan_id" : "P-5Y914095092784943MR7WPEQ",
        "schemes" : [
            {
                "id": "scheme13",
                "type": "scheme",
                "initiative_id": "initiative4",
                "image": "images/splschool_schemes/thumbnail_resize-19.png",
                "name": "MONTHLY THERAPY EXPENSES FOR 1 SPECIAL CHILD",
                "minimum_donation": 60,
                "currency": "USD",
                "description":"Provide uniform/diwali dress for one student per year"
            },
            {
                "id": "scheme14",
                "type": "scheme",
                "initiative_id": "initiative4",
                "image": "images/splschool_schemes/thumbnail_resize-20.png",
                "name": "MONTHLY EDUCATION FOR 1 SPECIAL CHILD",
                "minimum_donation": 115,
                "currency": "USD",
                "description":"Support the monthly expenses for one student"
            },
            {
                "id": "scheme15",
                "type": "scheme",
                "initiative_id": "initiative4",
                "image": "images/splschool_schemes/thumbnail_resize-01.png",
                "name": "YEARLY EDUCATION FOR 1 SPECIAL CHILD",
                "minimum_donation": 1380,
                "currency": "USD",
                "description":"Support therapy expenses for one student per year"
            },
            {
                "id": "scheme16",
                "type": "scheme",
                "initiative_id": "initiative4",
                "image": "images/splschool_schemes/thumbnail_resize-21.png",
                "name": "CORPUS - ADOPT 1 SPECIAL CHILD EDUCATION",
                "minimum_donation": 21000,
                "currency": "USD",
                "description":"Proceeds from this one time donation will be used for meeting the expenses for one day (of your choice) in a year"
            }
        ],
        "is_enabled_in_initiative_banner" : 1,
        "is_enabled_in_menu": 1
    },
    {
        "id": "initiative5",
        "type": "initiative",
        "image": "images/futureproject_schemes/comfort_medical_care.png",
        "name": "Future Projects",
        "link": "future_projects.html",
        "subscription_plan_id" : "P-5Y914095092784943MR7WPEQ",
        "schemes" : [
            {
                "id": "scheme17",
                "type": "scheme",
                "initiative_id": "initiative5",
                "image": "images/futureproject_schemes/comfort_medical_care.png",
                "name": "Comfort Care - SUPPORT ONE PATIENT FOR ONE YEAR",
                "minimum_donation": 138,
                "currency": "USD",
                "description":"Provide uniform/diwali dress for one student per year"
            },
            {
                "id": "scheme18",
                "type": "scheme",
                "initiative_id": "initiative5",
                "image": "images/futureproject_schemes/comfort_medical_care.png",
                "name": "Comfort Care - CORPUS - SUPPORT ONE PATIENT EVERY YEAR",
                "minimum_donation": 2300,
                "currency": "USD",
                "description":"Support the monthly expenses for one student"
            },
            {
                "id": "scheme19",
                "type": "scheme",
                "initiative_id": "initiative5",
                "image": "images/futureproject_schemes/palliative_care_center.png",
                "name": "Palliative Care - SUPPORT ONE PATIENT FOR ONE YEAR",
                "minimum_donation": 415,
                "currency": "USD",
                "description":"Support the monthly expenses for one student"
            },
            {
                "id": "scheme20",
                "type": "scheme",
                "initiative_id": "initiative5",
                "image": "images/futureproject_schemes/palliative_care_center.png",
                "name": "Palliative Care - CORPUS - SUPPORT ONE PATIENT EVERY YEAR",
                "minimum_donation": 7000,
                "currency": "USD",
                "description":"Support the monthly expenses for one student"
            }
        ],
        "is_enabled_in_initiative_banner" : 0,
        "is_enabled_in_menu": 1
    }
]

const ABOUT_US = {

    "ABOUT_ANANDAM_MIN_DESC": "",
    "ABOUT_SADANANDA_MIN_DESC": "Sadananda is a registered non-profit in the USA with the objective of supporting the needy and underprivileged people in India. We have partnered with Anandam, A Public Charitable Trust in Chennai, that has been supporting several philanthropic causes such as geriatric care, medical care and education including supporting children with learning disabilities, since 2003. Many well wishers living in the USA often want to support such initiatives and Sadananda’s partnership with Anandam provides a channel to facilitate the same.",
    "ABOUT_ANANDAM_DETAILED_DESC": "Smt. Bhageerathy Ramamoorthy, Founder and Managing Trustee of Anandam, when she was working in a Bank, witnessed the plight of aged people who had to give their entire pension funds to family members against their will. This had Smt. Bhageerathy introspect and think about the plight of aged people without any support, funds and sustenance. Thus was born Anandam, a free home for senior citizens in the year 2003. <br/><br/>True to its founding philosophy that everybody deserves a chance to live with dignity and happiness, Anandam has steered several pro-bono initiatives to bring less privileged  individuals under their umbrella of care and support in the last 20 years",
    "ABOUT_SADANANDA_DETAILED_DESC": "Sadananda is a registered non-profit in the USA with the objective of supporting the needy and underprivileged people in India. We have partnered with Anandam, A Public Charitable Trust in Chennai, that has been supporting several philanthropic causes such as geriatric care, medical care and education including supporting children with learning disabilities, since 2003. Many well wishers living in the USA often want to support such initiatives and Sadananda’s partnership with Anandam provides a channel to facilitate the same.",
    "CONTACT_PHONE": "tel:+1 (408) 674 4683",
    "CONTACT_EMAIL_ID": "mailto:ananda@sadananda.org",
    "CONTACT_ADDRESS": "12421 Enchanted Forest dr, Austin, TX 78727",
    "CONTACT_FACEBOOK_ID": "https://www.facebook.com/profile.php?id=100092506712735&mibextid=LQQJ4d",
    "CONTACT_TWITTER_ID": "",
    "LEGAL_DISCLAIMER": "This is the legal disclaimer to be set for ativities together. ABOUT_SADANANDA_DETAILED_DESC=Sadananda Anandam was registered in 1995 with the aim of supporting the lowe",
    "DONATION_CONTACT_NAME": "Rohit Dhamakar",
    "DONATION_TAX_EXEMPTION_CLAUSE": "Donations are tax exempted under section 501 (c) (3), US IRS code section 170; <strong>EID number – 87-4187319</strong>",
    "DONATION_CONFIRMATION_TEXT": `Dear <REPLACE_FIRST_NAME>, <br/> Thank you for your generous contribution as donation towards Sadananada. 
                                        <REPLACE_DONATION_DATA>
                                        

                                        `,
    "DONATION_FAILURE_TEXT": "Apologies. Your transaction was not successful. Please try again", 
    "DONATION_RESULTS_TEXT": `Dear <span class="badge bg-info"><REPLACE_FIRST_NAME></span><br/>
                                We truly can't thank you enough for your generous support to our initiatives such as <span class="badge bg-secondary"><REPLACE_INITIATIVE_NAME></span>.
                                Your support will allow us to continue helping the people in our community who need them most. People like you truly make a difference in the world, 
                                and we’re incredibly grateful!
    
                                <REPLACE_DONATION_RESULTS>
                                <br/>
                                <br/>
                                
                                Thank you again,<br/><br/>
                                Warm regards,<br/>
                                <REPLACE_CONTACT_NAME><br/>
                                Trustee, Sadananda
                                `,                    
}


const events_BANNER_DATA = [
    {
        "image": "images/default/NEW-Slide-1-Events.png",
        "heading":"",
        "sub_heading":"",
        "link" : "https://ticketing.events/app/portal/1/9383?channel=social"
    },
    {
        "image": "images/default/Slide-2-Events-page.jpg",
        "heading":"",
        "sub_heading":"",
        "link": "https://ticketing.events/app/portal/1/9382/austin-anandam-fundraising-concert"
    },
    {
        "image": "images/default/Event_New_Jersey.png",
        "heading":"",
        "sub_heading":"",
        "link": "https://ticketing.events/app/portal/1/9523/new-jersey-anandam-fundraising-concert/"
    }
]

const GALLERY_DATA = [
    {
        "image" :"images/banner_tmp_new_1.jpeg",
        "desc" : ""
    },
    {
        "image" :"images/lrn_cntr_spl_child_corpus_fund.jpeg",
        "desc" : ""
    },
    {
        "image" :"images/lrn_cntr_spl_child_year_therapy_expenses.jpeg",
        "desc" : ""
    },
    {
        "image" :"images/lrn_cntr_spl_child_monthly_expenses.jpeg",
        "desc" : ""
    },
    {
        "image" :"images/lrn_cntr_spl_child_sub_4.jpeg",
        "desc" : ""
    },
    {
        "image" :"images/medical_care_full_day_expenses.jpg",
        "desc" : ""
    }
]
