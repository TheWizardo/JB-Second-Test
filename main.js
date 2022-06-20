async function getInfo(url) {
    // fetching the data
    let raw_res = await fetch(url);
    // converting data to json;
    return await raw_res.json();
}

function addRow(table, ...values){
    // creating a row to house all values
    const row = document.createElement("tr");
    for (val of values){
        // creating the cell
        const cell = document.createElement("td");
        cell.innerText = val;
        row.appendChild(cell);
    }
    table.appendChild(row);
}

async function loadData(get_all) {
    let url = "https://restcountries.com/v3.1/all";
    let search_name = document.getElementById("country-name");
    if (!get_all) {
        // validation check for empty input
        if (search_name.value.length < 1) {
            alert("The search term cannot be empty!");
            return;
        }
        url = `https://restcountries.com/v3.1/name/${search_name.value}`
    }
    // fetching the data
    let data = await getInfo(url);

    // validation check for non existant search
    if (data.status === 404) {
        alert("The search term does not exists");
        search_name.value = "";
        location.reload();
        return;
    }

    // calculating the total population
    let total_pop = data.map(i => i.population).reduce((prev, curr) => prev + curr);

    document.getElementById("total-results").innerText = data.length;
    document.getElementById("total-population").innerText = total_pop;
    document.getElementById("avg-population").innerText = Math.floor(total_pop / data.length);

    const countries_table = document.getElementById("countires");
    // injecting the headers of the table
    countries_table.innerHTML = `<tr>
                                     <th>Country Name</th>
                                     <th>Number of citizens</th>
                                 </tr>`;

    const regions_table = document.getElementById("regions");
    // injecting the headers of the table
    regions_table.innerHTML = `<tr>
                                   <th>Region</th>
                                   <th>Number of countries</th>
                               </tr>`;

    const currencies_table = document.getElementById("currencies");
    // injecting the headers of the table
    currencies_table.innerHTML = `<tr>
                                      <th>Currency</th>
                                      <th>Number of countries</th>
                                  </tr>`;

    let regions = {};
    let currencies = {};
    data.forEach(country => {
        // building the table of countries
        addRow(countries_table, country.name.common, country.population);

        // incrementing the regions accordingly
        if (regions[country.region]) {
            regions[country.region] += 1;
        }
        else {
            regions[country.region] = 1;
        }

        // checking whether the counry has currencies
        if (country.currencies) {
            // incrementing the regions accordingly
            Object.keys(country.currencies).forEach(cur => {
                if (currencies[cur]) {
                    currencies[cur] += 1;
                }
                else {
                    currencies[cur] = 1;
                }
            });
        }
    });

    // building the table of regions
    Object.keys(regions).forEach(reg => addRow(regions_table, reg, regions[reg]));

    // building the table of currencies
    Object.keys(currencies).forEach(cur => addRow(currencies_table, cur, currencies[cur]));

    // dislpaying the information
    document.getElementById("container").style.display = "block";
}