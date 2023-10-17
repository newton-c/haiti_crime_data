library(tidyverse)
library(leaflet)
library(htmltools)
library(htmlwidgets)

# ACLED Violence 
acled <- read_csv("data/acledHaiti.csv") %>%
  filter(grepl("Gang", actor1) == TRUE) %>%
  mutate(events = fatalities + 1) %>%
  arrange(desc(fatalities))

m <- leaflet(data = acled) %>%
  addProviderTiles(providers$CartoDB.Positron,
                   options = providerTileOptions(minZoom = 8)) %>%
  addCircles(lat = ~latitude, lng = ~longitude, radius = ~fatalities * 1000,
  #addCircleMarkers(lat = ~latitude, lng = ~longitude, radius = ~fatalities,
                   popup = paste0("Perpetrator: ", acled$actor1, "<br/>",
                                  "Fatalities: ",
                                  "<span style='color: #b31536'>",
                                  acled$fatalities, 
                                  "</span><br/>",
                                  "Date: ", format(acled$event_date,
                                                   format = "%y/%m/%d"),
                                  "<br/>", "Location: ", acled$location),
                   stroke = 0,
                   color = "#B31536",
                   opacity = .2,
                   group = "All Groups")

m

saveWidget(m, "figs/m.html")

e <- leaflet(data = acled) %>%
  addProviderTiles(providers$CartoDB.Positron,
                   options = providerTileOptions(minZoom = 8)) %>%
  addCircles(lat = ~latitude, lng = ~longitude, radius = ~events * 1000,
                   popup = paste0("Perpetrator: ", acled$actor1, "<br/>",
                                  "Event Type: ", acled$sub_event_type, "<br/>",
                                  "Fatalities: ",
                                  "<span style='color: #b31536'>",
                                  acled$fatalities, 
                                  "</span><br/>",
                                  "Date: ", format(acled$event_date,
                                                   format = "%y/%m/%d"),
                                  "<br/>", "Location: ", acled$location),
                   stroke = 0,
                   color = "#B31536",
                   opacity = .2,
                   group = "All Groups")
e

saveWidget(e, "figs/e.html")

# Hunger choropleth

haiti_geo <- geojsonio::geojson_read("data/Haiti-Acute Food Insecurity August 2023.json",
                                     what = "sp")

labels <- sprintf(
  "<strong>%s</strong><br/>%g&#37; facing a hunger crisis",
  haiti_geo$area, haiti_geo$p3_plus_C_population_percentage * 100
) %>% lapply(htmltools::HTML)

pal <- colorNumeric(c("#FAFAFA", "#B31536"),
                    domain = c(0, max(haiti_geo$p3_plus_C_population_percentage)))
h <- leaflet(haiti_geo, options = leafletOptions(zoomControl = FALSE)) %>%
  addProviderTiles(providers$CartoDB.Positron,
                   options = providerTileOptions(minZoom = 8)) %>%
  addPolygons(
    fillColor = ~pal(p3_plus_C_population_percentage),
    weight = 1,
    opacity = 1,
    color = "#3B3B3B",
    fillOpacity = .8,
    highlightOptions = highlightOptions(
      weight = 2,
      bringToFront = TRUE),
    label = labels,
    labelOptions = labelOptions(
      style = list("font-weight" = "normal", padding = "3px 8px"),
      textsize = "15px",
      direction = "auto")) %>%
  addLegend("topleft", pal = pal, values = ~p3_plus_C_population_percentage,
            title = sprintf("Population Suffering<br>From Emergency<br>Hunger or Worse<br>"),
            labFormat = labelFormat(suffix = "%",
                                    transform = function(x) 100 * x),
            opacity = 1)
h


saveWidget(h, "figs/h.html")
