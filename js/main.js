// register the grid component
Vue.component("app-grid", {
    template: "#grid-template",
    props: {
        data: Array,
        columns: Array,
        labels: Array,
        filterKey: String
    },
    data: function() {
        var sortOrders = {};
        this.columns.forEach(function(key) {
            sortOrders[key] = 1;
        });
        return {
            sortKey: "",
            sortOrders: sortOrders
        };
    },
    computed: {
        filteredData: function() {
            var sortKey = this.sortKey;
            var filterKey = this.filterKey && this.filterKey.toLowerCase();
            var order = this.sortOrders[sortKey] || 1;
            var data = this.data;
            if (filterKey) {
                data = data.filter(function(row) {
                    return Object.keys(row).some(function(key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                    });
                });
            }
            if (sortKey) {
                data = data.slice().sort(function(a, b) {
                    a = a[sortKey];
                    b = b[sortKey];
                    return (a === b ? 0 : a > b ? 1 : -1) * order;
                });
            }
            return data;
        }
    },
    methods: {
        sortBy: function(key) {
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1;
        },
        formatValue(value, key) {
            if (key == "grossUnadjusted" || key == "grossAdjusted") {
                console.log(key);
                if (value != null) {
                    return "$" + value.toLocaleString("en-US", { style: "decimal" });
                }
            } else {
                return value;
            }
        }
    }
});

var app = new Vue({
    el: "#app",
    data: {
        searchQuery: "",
        gridColumns: ["film", "studio", "grossUnadjusted", "grossAdjusted", "year"],
        gridLabels: ["Film", "Studio", "Gross", "Adjusted", "Year"],
        gridData: []
    },
    methods: {
        fetchFilmData: function() {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.open(
                "GET",
                "data/moviesByGross.json"
            );
            xhr.onload = function() {
                self.gridData = JSON.parse(xhr.responseText);
            };
            xhr.send();
        }
    }
});
app.fetchFilmData();