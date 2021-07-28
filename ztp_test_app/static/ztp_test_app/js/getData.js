const getDataButton = document.querySelector("#get_customer_data");
const jsContent = document.querySelector(".js_content");

const getHighestRateCustomer = (data, rate) => {
  // loop through customers to find highest rate value then return table
  // cells of details
  // use first customer as proxy
  let customerWithHighestRate = data[0];
  data.forEach((customer) => {
    if (
      customer.energy_consumption[rate] >
      customerWithHighestRate.energy_consumption[rate]
    ) {
      customerWithHighestRate = customer;
    }
  });
  return `
  <td>${customerWithHighestRate.name}</td>
  <td>${customerWithHighestRate.energy_consumption["Day Rate"]}</td>
  <td>${
    customerWithHighestRate.energy_consumption["Night Rate"]
      ? customerWithHighestRate.energy_consumption["Night Rate"]
      : 0
  }</td>
  <td>${customerWithHighestRate.total_cost}</td>
  `;
};

const getHighestTotalCostCustomer = (data) => {
  // loop through customers to find highest total cost value then return table
  // cells of details
  // use first customer as proxy
  let customerWithHighestTotalCost = data[0];

  data.forEach((customer) => {
    if (customer.total_cost > customerWithHighestTotalCost.total_cost) {
      customerWithHighestTotalCost = customer;
    }
  });

  return `
  <td>${customerWithHighestTotalCost.name}</td>
  <td>${customerWithHighestTotalCost.energy_consumption["Day Rate"]}</td>
  <td>${
    customerWithHighestTotalCost.energy_consumption["Night Rate"]
      ? customerWithHighestTotalCost.energy_consumption["Night Rate"]
      : 0
  }</td>
  <td>${customerWithHighestTotalCost.total_cost}</td>
  `;
};

const renderTables = (data) => {
  const customers = Object.keys(data.results);
  const results = Object.values(data.results);

  return `<table class="dynamic-content text-center">
    <caption>Customers With Highest Consumption/Costs</caption>
    <thead>
    <tr>
      <th></th>
      <th>Customer Name</th>
      <th>Day Rate Consumption (kWh)</th>
      <th>Night Rate Consumption (kWh)</th>
      <th>Total Cost (£)</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>Customer With Highest Day Rate Consumption</td>
      ${getHighestRateCustomer(results, "Day Rate")}
    </tr>
    <tr>
      <td>Customer With Highest Night Rate Consumption</td>
      ${getHighestRateCustomer(results, "Night Rate")}
    </tr>
    <tr>
      <td>Customer With Highest Total Energy Cost</td>
      ${getHighestTotalCostCustomer(results)}
      </tr>
      </tbody>
  </table>
  
  <table class="dynamic-content text-center">
  <caption>All Customer Energy Usage Data</caption>
  <thead>
      <tr><th></th>${customers
        .map((customer) => `<th>${customer}</th>`)
        .join("")}</tr>
        </thead>
        <tbody>
      <tr><td>Name</td>${results
        .map((customer) => `<td>${customer.name}</td>`)
        .join("")}</tr>
      <tr><td>Address</td>${results
        .map((customer) => `<td>${customer.address}</td>`)
        .join("")}</tr>
      <tr><td>Meter Number</td>${results
        .map((customer) => `<td>${customer.meter_number}</td>`)
        .join("")}</tr>
        <tr><td>Day Rate Usage (kWh)</td>${results
          .map(
            (customer) =>
              `<td>${
                customer.energy_consumption["Day Rate"]
                  ? customer.energy_consumption["Day Rate"]
                  : "0"
              }</td>`
          )
          .join("")}</tr>
          <tr><td>Night Rate Usage (kWh)</td>${results
            .map(
              (customer) =>
                `<td>${
                  customer.energy_consumption["Night Rate"]
                    ? customer.energy_consumption["Night Rate"]
                    : "0"
                }</td>`
            )
            .join("")}</tr>
            <tr><td>Weekend Rate Usage (kWh)</td>${results
              .map(
                (customer) =>
                  `<td>${
                    customer.energy_consumption["Weekend Rate"]
                      ? customer.energy_consumption["Weekend Rate"]
                      : "0"
                  }</td>`
              )
              .join("")}</tr>
              <tr><td>Weekend Day Rate Usage (kWh)</td>${results
                .map(
                  (customer) =>
                    `<td>${
                      customer.energy_consumption["Weekend Day Rate"]
                        ? customer.energy_consumption["Weekend Day Rate"]
                        : "0"
                    }</td>`
                )
                .join("")}</tr>
                <tr><td>Weekend Night Rate Usage (kWh)</td>${results
                  .map(
                    (customer) =>
                      `<td>${
                        customer.energy_consumption["Weekend Night Rate"]
                          ? customer.energy_consumption["Weekend Night Rate"]
                          : "0"
                      }</td>`
                  )
                  .join("")}</tr>
                    <tr><td>Total Cost (£)</td>${results
                      .map(
                        (customer) =>
                          `<td>${customer.total_cost.toFixed(2)}</td>`
                      )
                      .join("")}</tr>
                </tbody>
    </table>
  `;
};

getDataButton.addEventListener("click", () => {
  fetch("/getdata")
    .then((response) => response.json())
    .then((data) => renderTables(data))
    .then((table) => (jsContent.innerHTML = [table]))
    .catch((err) => console.log(err));
});
