<template>
  <div id="app">
    <site-header />
    <div class="middle">
      <div id="map" class="mapkit"></div>
      <div class="filter">

        <table class="table">
          <thead>
            <tr>
              <th colspan="2"><strong>Summary</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: right">{{this.bikes.length}}</td>
              <td>total bikes</td>
            </tr>
            <tr>
              <td style="text-align: right">{{lowBatteryCount()}}</td>
              <td>reported low battery</td>
            </tr>
            <tr>
              <td style="text-align: right">{{frequentlyUsedCount()}}</td>
              <td>are frequently used</td>
            </tr>
            <tr>
              <td style="text-align: right">{{reportedTodayCount()}}</td>
              <td>reported today</td>
            </tr>
            <tr>
              <td style="text-align: right">{{notReportedTodayCount()}}</td>
              <td>no report in today</td>
            </tr>
            <tr>
              <td style="text-align: right">{{notReportedTwoTodayCount()}}</td>
              <td>no report in two days</td>
            </tr>
            <tr>
              <td style="text-align: right">{{notReportedThreeTodayCount()}}</td>
              <td>no report in three days</td>
            </tr>
          </tbody>
        </table>
        <table class="table">
          <thead>
            <tr>
              <th colspan="2"><strong>Filters</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Model</td>
              <td>
                <label class="checkbox">
                  <input v-model="showBikes" v-on:change="updateBikes" type="checkbox">
                  Bike
                </label>
                <label class="checkbox">
                  <input v-model="showEBikes" v-on:change="updateBikes" type="checkbox">
                  E-Bike
                </label>
                <label class="checkbox">
                  <input v-model="showStations" v-on:change="updateStations" type="checkbox">
                  Stations
                </label>
              </td>
            </tr>
            <tr>
              <td style="white-space: nowrap;">On Station</td>
              <td>
                <label class="checkbox">
                  <input v-model="hideBikesInStation" v-on:change="updateBikes" type="checkbox">
                  Hide Parked in Station
                </label>
              </td>
            </tr>
            <tr>
              <td>Color Pins</td>
              <td>
                <div class="select">
                <select v-model="colorMode" v-on:change="updateBikes">
                  <option value="normal">Default</option>
                  <option value="battery">by Battery</option>
                  <option value="usage">by Usage</option>
                  <option value="lastReported">by Last Reported</option>
                </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="field">
          <div class="control search-field">
            <input v-model="search" class="input is-info" type="search" placeholder="Serach for serial">
          </div>
        </div>

      </div>
    </div>

    <div>
      <div class="footer">
        MIT Licensed | Copyright © 2018-present <a href="https://yannickweiss.com">Yannick Weiss</a>
      </div>
    </div>
  </div>
</template>

<script>

import SiteHeader from '@/components/SiteHeader.vue';

export default {
  name: 'app',
  components: {
    SiteHeader
  },
  data () {
    return {
      map: null,
      stations: [],
      bikes: [],
      showStations: true,
      showBikes: true,
      showEBikes: true,
      hideBikesInStation: false,
      colorMode: 'normal',
      search: '',
    }
  },
  mounted() {
    // getting mapkit from applem with a token I generated which will live for a year
    // https://developer.apple.com/documentation/mapkitjs
    mapkit.init({authorizationCallback: function(done) {
      // the mapkit token contains a origin check, sorry
      done('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjhXUjlXRDM5QjgifQ.eyJpc3MiOiJOREpIRE5LWEQ2IiwiaWF0IjoxNTMwMDIxODc5LCJleHAiOjE1NjExMjU4NzksIm9yaWdpbiI6Imh0dHBzOi8vbm9iaWtlbGVmdGJlaGluZC5jaCJ9.kOiyB2e6u7IonfIU9Q0ytXC4bzPP_0m8RtPgj1-ggGamWk0r2UpSVnLMHjalAjURG1vOCVCPpuaIU4m5s2jvSA');
    }});
    var coordinates = new mapkit.Coordinate(47.39847392642267, 8.468661308879746);
    var span = new mapkit.CoordinateSpan(0.2344199452479998, 0.45730816412392983);
    var region = new mapkit.CoordinateRegion(coordinates, span);

    this.map = new mapkit.Map('map', {
      region: region,
      showsUserLocationControl: true,
      showsScale: mapkit.FeatureVisibility.Visible,
      tintColor: '#0071bb',
    });

    var host = window.document.location.host.replace(/:.*/, '');
    // TODO: remove for demo
    //host = 'localhost';
    host = 'nobikeleftbehind.ch';
    var ws = new WebSocket('wss://' + host + ':8082');
    ws.onmessage = (event) => {
      try {
        var d = JSON.parse(event.data);
        if (d.stations !== undefined && d.bikes !== undefined) {
          // initial data
          this.stations = d.stations;
          this.bikes = d.bikes;
          this.updateAnnotations();
        } else {
          // update object
        }
      } catch(e) {
        console.error(e);
      }
    };
  },
  methods: {
    updateAnnotations() {
      this.updateStations();
      this.updateBikes();
    },
    updateBikes() {

      var calloutDelegate = {
          // Return a div element and populate it with information from the
          // annotation, including a link to a review site.
          calloutRightAccessoryForAnnotation: function(annotation) {
              var usageLabels = ['Not Used', 'Used Once', 'Used Often', 'Used Heavily'];
              var element = document.createElement("div");
              element.className = 'review-callout-content';
              var serial = element.appendChild(document.createElement('h1'));
              serial.textContent = annotation.data.serial;

              var battery = element.appendChild(document.createElement('p'));
              battery.textContent = 'Battery: ' + annotation.data.battery + '%';

              var usage = element.appendChild(document.createElement('p'));

              usage.textContent = 'Usage: ' + usageLabels[annotation.data.health_score];

              var lastUsed = element.appendChild(document.createElement('p'));
              lastUsed.textContent = relativeDateString(annotation.data.timestamp);

              var link = element.appendChild(document.createElement('a'));
              link.href = '';
              link.textContent = 'Show History';
              return element;
          }
      };




      this.bikes.forEach((b) => {
        if (b.annotation === undefined) {
          if (Math.floor(b.lat) === 0) {
            return;
          }

          var coordinate = new mapkit.Coordinate(b.lat, b.lng);
          var annotation = new mapkit.MarkerAnnotation(coordinate, {
            title: b.type,
            callout: calloutDelegate,
            data: b,
            // glypColor: '', color of the icon inside the marker
            // glyphImage: {2:'font-awesome_4-7-0_home_50_0_ffffff_none.png'}, // icon inside the marker
            // selectedGlyphImage: {2:'icon.png'}, // icon for when marker is selected, can be bigger
            glyphText: this.glyphTextForBike(b), // text shown inside marker, recommend max 1-3 length
            displayPriority: b.station === 0 ? 1000 : 500, // bikes without station are top prio
          });
          if (b.station > 0) {
            // cluster bikes on the same station together
            annotation.clusteringIdentifier = String(b.station);
          }
          this.map.addAnnotation(annotation);
          b.annotation = annotation;
        }

        b.annotation.color = this.markerColorForBike(b);

        if (this.hideBikesInStation && b.station > 0) {
          b.annotation.visible = false;
          return;
        }


        if (b.type === 'Bike') {
          b.annotation.visible = this.showBikes;
        }
        if (b.type === 'E-Bike') {
          b.annotation.visible = this.showEBikes;
        }

      });

    },
    updateStations() {
      this.stations.forEach((s) => {
        if (s.annotation === undefined) {
          var coordinate = new mapkit.Coordinate(s.lat, s.lng);
          var annotation = new mapkit.MarkerAnnotation(coordinate, {
            title: s.name,
            subtitle: s.state,
            color: '#ad1380', // marker color
            // glypColor: '', color of the icon inside the marker
            //glyphImage: {2:'font-awesome_4-7-0_home_50_0_ffffff_none.png'}, // icon inside the marker
            // selectedGlyphImage: {2:'icon.png'}, // icon for when marker is selected, can be bigger
            glyphText: 'S', // text shown inside marker, recommend max 1-3 length
            clusteringIdentifier: 'stations', // multiple marker with the same are combined to one
            displayPriority: 0, // higher priority gets drawn over the other
          });
          this.map.addAnnotation(annotation);
          s.annotation = annotation;
        }
        s.annotation.visible = this.showStations;
      });
    },
    markerColorForBike(b) {
      if (this.colorMode === 'normal') {
        if (b.battery <= 20) {
          return '#FF2600'; // red
        } else if (b.health_score === 0) {
          return '#BD6BA4'; // bike not used, small soft violett
        } else {
          return '#ad1380'; // TODO: can I return RGBA with opacity?
        }

      } else if (this.colorMode === 'battery') {
        if (b.battery <= 20) {
          return '#FF2600'; // red
        } else if (b.battery <= 50) {
          return '#FF9300'; // orange
        } else {
          return '#009300'; // green
        }
      } else if (this.colorMode === 'usage') {
        // grey to green
        if (b.health_score === 0) {
          return '#646464'; // grey
        } else if (b.health_score === 1) {
          return '#648A64';
        } else if (b.health_score === 2) {
          return '#52A956';
        } else {
          return '#0FE61F';
        }
      } else if (this.colorMode === 'lastReported') {
        var date = new Date(b.timestamp); // Could be that it does not work in all browsers
        var now = new Date();
        var diff = now - date;
        var hrs = Math.floor(diff / (1000*60*60));
        if (hrs === 0) {
          return '#0FE61F'; // green
        } else if (hrs < 6) {
          return '#52A956';
        } else if (hrs < 12) {
          return '#648A64';
        } else if (hrs < 24) {
          return '#648A64'; // grey
        } else if (hrs < 48) {
          return '#FF9300'; // grey
        } else {
          return '#FF2600'; // red
        }
      } else {
        return '#ad1380';
      }
    },
    glyphTextForBike(b) {
      var letter = b.type === 'Bike' ? 'B' : 'E'
      var date = new Date(b.timestamp); // Could be that it does not work in all browsers
      var now = new Date();
      var diff = now - date;
      var hrs = Math.floor(diff / (1000*60*60));
      if (hrs >= 24) {
        letter = letter + '?';
      }
      return letter;
    },
    lowBatteryCount() {
      return this.bikes.filter(function(b) {
        return b.battery <= 20;
      }).length;
    },
    frequentlyUsedCount() {
      return this.bikes.filter(function(b) {
        return b.health_score > 1;
      }).length;
    },
    reportedTodayCount() {
      return this.bikes.filter(function(b){
        var date = new Date(b.timestamp); // Could be that it does not work in all browsers
        var now = new Date();
        var diff = now - date;
        var hrs = Math.floor(diff / (1000*60*60));
        return hrs < 12;
      }).length;
    },
    notReportedTodayCount() {
      return this.bikes.filter(function(b){
        var date = new Date(b.timestamp); // Could be that it does not work in all browsers
        var now = new Date();
        var diff = now - date;
        var hrs = Math.floor(diff / (1000*60*60));
        return hrs >= 12;
      }).length;
    },
    notReportedTwoTodayCount() {
      return this.bikes.filter(function(b){
        var date = new Date(b.timestamp); // Could be that it does not work in all browsers
        var now = new Date();
        var diff = now - date;
        var hrs = Math.floor(diff / (1000*60*60));
        return hrs >= 2*24;
      }).length;
    },
    notReportedThreeTodayCount() {
      return this.bikes.filter(function(b){
        var date = new Date(b.timestamp); // Could be that it does not work in all browsers
        var now = new Date();
        var diff = now - date;
        var hrs = Math.floor(diff / (1000*60*60));
        return hrs >= 3*24;
      }).length;
    }
  }
}

function relativeDateString(d) {
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var date = new Date(d); // Could be that it does not work in all browsers
  var now = new Date();
  var diff = now - date;
  var sec = Math.floor(diff / (1000))
  if (sec < 60) {
    return sec + ' seconds ago';
  }
  var min = Math.floor(diff / (1000*60))
  if (min < 60) {
    if (min == 1) {
      return '1 minute ago';
    }
    return min + ' minutes ago';
  }
  var hrs = Math.floor(diff / (1000*60*60))
  if (hrs < 24) {
    if (hrs == 1) {
      return '1 hour ago';
    }
    return hrs + ' hours ago';
  }
  var days = Math.floor(diff / (1000*60*60*24))
  if (days <= 5) {
    if (days == 1) {
      return '1 day ago';
    }
    return days + ' days ago';
  }
  return date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear();
}

</script>

<style lang="scss">

.review-callout-content {
  text-align: left;
  h1 {
    font-weight: bold;
  }
}

.search-field {
  margin: 10px;
}

.middle {
  display: flex;
}

.mapkit {
  flex: 200px 1 1;
}

.filter {
  //padding: 10px;
  flex: 350px 0 0;
  //background-color: rgba($color: #ffaadd, $alpha: 0.3);
}

// footer

.footer {
  padding: 2.5rem;
  border-top: 1px solid #eaecef;
  text-align: center;
  color: #4e6e8e;
}

// Global stuff
a {
  font-weight: 500;
  text-decoration: none;
}

.table {
  margin-bottom: 0 !important;
}

.checkbox {
  margin-right: 5px;
}

.checkbox input {
  vertical-align: middle;
}

#app {
  //font-family: 'Avenir', Helvetica, Arial, sans-serif;
  //font-family: -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
