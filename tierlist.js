const tiers = [
    {"name": "S", "color": "green"},
    {"name": "A", "color": "yellowgreen"},
    {"name": "B", "color": "yellow"},
    {"name": "C", "color": "orange"},
    {"name": "D", "color": "orangered"},
    {"name": "F", "color": "red"},
]

let createTier = (tier) => {
    let tier_id = `${tier.name}-tier`

    // Create row (contains lsbel and elements)
    let row = document.createElement("div")
    row.className = "row"

    // Create label (S, A, B, ...)
    let label = document.createElement("div")
    label.id = tier_id
    label.className = "label"
    label.innerHTML = tier.name
    label.style.backgroundColor = tier.color

    // Add to document
    row.appendChild(label)
    board.appendChild(row)
}

let wrapImg = (link, imgElement, tier_div) => {
    // Wrap an img tag, if a link is provided.
    let wrapped
    if (link !== null) {
        let a = document.createElement("a")
        a.href = link
        a.target = "_blank"
        a.appendChild(imgElement)
        wrapped = a
    } else {
        wrapped = imgElement
    }
    tier_div.appendChild(wrapped)
}

let addToTier = (gary) => {
    // Add a Gary to their indicated tier

    let tier_id = `${gary.tier}-tier`
    let tier_div = document.getElementById(tier_id).parentNode

    // Create card (to contain img)
    let card = document.createElement("div")
    card.className = "card"

    // Create img element
    let img = document.createElement("img")
    let img_src = `images/${gary.filename}`
    img.src = img_src
    img.alt = gary.name
    let tooltipContent = `<h2>${gary.name}</h2>${gary.reason}`

    tippy(img, {
        content: tooltipContent, 
        allowHTML: true,
        placement: "top", 
        arrow: true
    })

    // Add to document
    card.appendChild(img)
    wrapImg(gary.link, card, tier_div) 
}

let organizeGarys = (garys) => {
    // Embrark on a truly abhorent task
    // **shudder**
    let garys_by_tier = {}
    garys.forEach((g) => {
        if (!(g.tier in garys_by_tier)) {
            garys_by_tier[g.tier] = []
        }
        garys_by_tier[g.tier].push(g)
    })
    return garys_by_tier
}

let buildTierList = () => {
    // Build the Gary Tier List

    // Load Garys
    fetch('gary_data.json')
        .then((r) => r.json())
        .then((garys) => {
            let garys_by_tier = organizeGarys(garys)
        
            // Create HTML elements for each tier
            tiers.forEach((t) => {
                createTier(t)
            })
            
            // Sort Garys by weight and add cards
            for (const garys of Object.values(garys_by_tier)) {
                let sorted_garys = garys.sort((a, b) => a.weight - b.weight)
                sorted_garys.forEach((gary) => {
                    addToTier(gary)
                })
            }

        })
        .catch((err) => {
            console.error('Failed to load gary_data.json:', err)
            document.getElementById('board').innerHTML = '<p style="color:white;padding:20px;">Failed to load data. Please refresh.</p>'
        })
}

buildTierList()