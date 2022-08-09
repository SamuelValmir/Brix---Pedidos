import table from "./homeWriter.js";
import { updateFormPayment, changeFormVisibility } from "./home.js"

function createSelectedItemElement(quantity, description, totalPrice, priceWithService, rowId) {
    const tableRowElement = document.createElement("tr");
    tableRowElement.classList.add("text-center");
    tableRowElement.setAttribute("data-rowId", rowId);

    const quantityElement = document.createElement("td");
    quantityElement.classList.add("selected-item-quantity", "align-middle");
    quantityElement.textContent = quantity + " x";

    const arrowsContainer = document.createElement("td");
    arrowsContainer.classList.add("arrows-container", "position-relative", "align-middle");

    const arrowsElement = document.createElement("div");
    arrowsElement.classList.add("d-flex", "arrows");

    const arrowLeftElement = document.createElement("div");
    arrowLeftElement.classList.add("arrow", "arrow_left");
    arrowLeftElement.addEventListener("click", () => { changeItemQuantity(rowId, -1) });

    const arrowRightElement = document.createElement("div");
    arrowRightElement.classList.add("arrow", "arrow_right");
    arrowRightElement.addEventListener("click", () => { changeItemQuantity(rowId, 1) });

    const descriptionElement = document.createElement("td");
    descriptionElement.classList.add("selected-item-description", "align-middle");
    descriptionElement.textContent = description;

    const totalPriceElement = document.createElement("td");
    totalPriceElement.classList.add("selected-item-total-price", "align-middle");
    totalPriceElement.textContent = totalPrice + " R$";

    const priceWithServiceElement = document.createElement("td");
    priceWithServiceElement.classList.add("align-middle");
    priceWithServiceElement.textContent = priceWithService + " R$";

    const btnContainer = document.createElement("td");
    btnContainer.classList.add("align-middle");

    const btnElement = document.createElement("div");
    btnElement.classList.add("btn", "btn-close", "text-bg-danger");
    btnElement.addEventListener("click", () => { deleteItem(rowId) });

    tableRowElement.appendChild(quantityElement);
    tableRowElement.appendChild(arrowsContainer);

    arrowsContainer.appendChild(arrowsElement);
    arrowsElement.appendChild(arrowLeftElement);
    arrowsElement.appendChild(arrowRightElement);

    tableRowElement.appendChild(descriptionElement);
    tableRowElement.appendChild(totalPriceElement);
    tableRowElement.appendChild(priceWithServiceElement);
    tableRowElement.appendChild(btnContainer);

    btnContainer.appendChild(btnElement);

    return tableRowElement;
    // It will build a html exactly like this:
    //
    // return `
    // <tr class="text-center" data-rowId="${rowId}">
    //     <td class="selected-item-quantity align-middle">${quantity} x</td>
    //     <td class="arrows-container position-relative align-middle">
    //         <div class="d-flex arrows">
    //             <div class="arrow arrow_left" onclick="changeItemQuantity(rowId, -1)"></div>
    //             <div class="arrow arrow_right" onclick="changeItemQuantity(rowId, 1)"></div>
    //         </div>
    //     </td>
    //     <td class="selected-item-description align-middle">${description}</td>
    //     <td class="selected-item-total-price align-middle">${totalPrice} R$</td>
    //     <td class="align-middle">${priceWithService} R$</input>
    //     </td>
    //     <td class="align-middle">
    //         <div class="btn btn-close text-bg-danger" onclick="deleteItem(rowId)"></div>
    //     </td>
    // </tr>        
    //     `;
};
function deleteItem(rowId) {
    const quantityInputElement = document.getElementById(rowId).children[2].children[0];
    quantityInputElement.value = 0;
    table.quantityInputListener(quantityInputElement, table);
};


function changeItemQuantity(rowId, quantity) {
    const quantityInputElement = document.getElementById(rowId).children[2].children[0];
    quantityInputElement.value = Number(quantityInputElement.value) + quantity;
    table.quantityInputListener(quantityInputElement, table);
};

function changeItemService(rowId, isService) {
    const checkboxServiceElement = document.getElementById(rowId).children[1].children[0];
    checkboxServiceElement.checked = isService;
    const selectedItemObject = table.selectedItemsModel.getSelectedItemByRowId(rowId);
    selectedItemObject["automaticService"] = isService;
    updateSelectedItemsContainer();
};

function updateSelectedItemsContainer() {
    changeNoItemMessageVisibility();

    table.selectedItemsModel.items.forEach(selectedItemModel => {
        let priceWithService;

        if (selectedItemModel.service) {
            priceWithService = selectedItemModel.getFinalPrice();
        } else {
            priceWithService = 0;
        };

        table.selectedItemsContainer.append(createSelectedItemElement(
            selectedItemModel.quantity,
            selectedItemModel.description,
            selectedItemModel.getCapitalPrice().toFixed(2),
            priceWithService.toFixed(2),
            selectedItemModel.rowId
        ));
    });

    updateFormPayment();
};

function changeNoItemMessageVisibility() {
    const noItemMessage = document.querySelector("#noSelectedItem");
    const selectedItemsTable = document.querySelector("#selectedItems");
    table.selectedItemsContainer.innerHTML = "";

    if (table.selectedItemsModel.items.length === 0) {
        noItemMessage.classList.remove("visually-hidden");
        selectedItemsTable.classList.add("visually-hidden");
        changeFormVisibility(false);
    } else {
        noItemMessage.classList.add("visually-hidden");
        selectedItemsTable.classList.remove("visually-hidden");
        changeFormVisibility(true);
    };
};

const selectedItems = {
    createSelectedItemElement,
    deleteItem,
    changeItemQuantity,
    changeItemService,
    updateSelectedItemsContainer,
    changeNoItemMessageVisibility
};

export default selectedItems;
