library(tidyverse)
library(leaflet)
library(htmltools)
library(htmlwidgets)

acled <- read_csv("data/acledHaiti.csv")

vhg <- filter(acled, actor1 == "Vitelhomme Gang")

m <- leaflet(data = acled) %>%
  addProviderTiles(providers$CartoDB.Positron) %>%
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
                   group = "All Groups") %>%
  addCircleMarkers(lat = ~latitude, lng = ~longitude, radius = ~fatalities,
                   popup = paste0("Perpetrator: ", vhg$actor1, "<br/>",
                                  "Fatalities: ",
                                  "<span style='color: #b31536'>",
                                  vhg$fatalities, 
                                  "</span><br/>",
                                  "Date: ", format(vhg$event_date,
                                                   format = "%y/%m/%d"),
                                  "<br/>", "Location: ", vhg$location),
                   stroke = 0,
                   color = "#10259b",
                   opacity = .2,
                   group = "Vitelhomme Gang",
                   data = vhg) %>%
  addLayersControl(
    baseGroups = c("All Groups", "Vitelhomme Gang"),
    options = layersControlOptions(collapsed = FALSE)
  )
m

saveWidget(m, "figs/m.html")
