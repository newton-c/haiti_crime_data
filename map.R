library(tidyverse)
library(leaflet)
library(htmltools)
library(htmlwidgets)

# ACLED Violence 
acled <- read_csv("data/acledHaiti.csv") %>%
  filter(grepl("Gang", actor1) == TRUE)

m <- leaflet(data = acled) %>%
  addProviderTiles(providers$CartoDB.Positron,
                   options = providerTileOptions(minZoom = 8)) %>%
  addCircleMarkers(lat = ~latitude, lng = ~longitude, radius = ~fatalities,
                   popup = paste0("Perpetrator: ", acled$actor1, "<br/>",
                                  "Fatalities: ",
                                  "<span style='color: #b31536'>",
                                  acled$fatalities, 
                                  "</span><br/>",
                                  "Date: ", format(acled$event_date,
                                                   format = "%y/%m/%d"),
                                  "<br/>", "Location: ", acled$location),
                   stroke = 0,
                   color = "#10259b",
                   opacity = .2,
                   group = "All Groups")
m

saveWidget(m, "figs/m.html")

# Hunger choropleth

haiti_geo <- geojsonio::geojson_read("data/Haiti-Acute Food Insecurity August 2023.json",
                                     what = "sp")

labels <- sprintf(
  "<strong>%s</strong><br/>%g&#37; facing a hunger crisis",
  haiti_geo$area, haiti_geo$p3_plus_C_population_percentage * 100
) %>% lapply(htmltools::HTML)

pal <- colorNumeric(c("#FAFAFA", "#F5E63D", "#CD771C", "#AB0002"),
                    domain = c(0, max(haiti_geo$p3_plus_C_population_percentage)))
h <- leaflet(haiti_geo) %>%
  addProviderTiles(providers$CartoDB.Positron,
                   options = providerTileOptions(minZoom = 8)) %>%
  addPolygons(
    fillColor = ~pal(p3_plus_C_population_percentage),
    weight = 2,
    opacity = 1,
    color = "#3B3B3B",
    fillOpacity = .7,
    highlightOptions = highlightOptions(
      weight = 4,
      bringToFront = TRUE),
    label = labels,
    labelOptions = labelOptions(
      style = list("font-weight" = "normal", padding = "3px 8px"),
      textsize = "15px",
      direction = "auto"))
h


saveWidget(h, "figs/h.html")
