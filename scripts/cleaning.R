library(tidyverse)
library(readxl)
library(ICplots)

theme_set(theme_ic())

latam <- c("Peru", "Nicaragua", "Mexico", "Haiti", "Honduras", "Guatemala",
           "Ecuador", "El Salvador", "Colombia", "Brazil", "Bolivia")
    
# https://www.internal-displacement.org/database/displacement-data
idps <- read_xlsx("data/IDMC_Internal_Displacement_Conflict-Violence_Disasters.xlsx") %>%
  #filter(Name %in% latam) %>%
  rename_with(~ tolower(gsub(" ", "_", .x, fixed = TRUE))) %>%
  rename_with(~ tolower(gsub("(", "", .x, fixed = TRUE))) %>%
  rename_with(~ tolower(gsub(")", "", .x, fixed = TRUE)))

idps_lag <- idps %>%
  mutate(year = year + 1) %>%
  rename(c(conflict_stock_displacement_lag = conflict_stock_displacement,
           conflict_stock_displacement_raw_lag = conflict_stock_displacement_raw,
           conflict_internal_displacements_lag = conflict_internal_displacements,
           conflict_internal_displacements_raw_lag = conflict_internal_displacements_raw))

idps <- full_join(idps, idps_lag) %>%
  #replace(is.na(.), 0.001) %>%
  mutate(change_internal_dispalcements = (((conflict_internal_displacements -
                                          conflict_internal_displacements_lag) /
                                          conflict_internal_displacements_lag) *
                                          100)) %>%
  select(name, year, conflict_internal_displacements,
         change_internal_dispalcements)

rm(idps_lag)

idps_la <- idps %>%
  filter(name %in% latam)

ipds_la_year <- idps_la %>%
  group_by(year) %>%
  summarise(conflict_internal_displacements =
              sum(conflict_internal_displacements,na.rm = TRUE))

ggplot() +
  geom_line(subset(ipds_la_year, year != 2023),
            mapping = aes(x = year, y = conflict_internal_displacements))

ggplot() +
  geom_line(subset(idps, name == "Haiti" & year != 2023),
            mapping = aes(x = year, y = conflict_internal_displacements,
                          group = name, color = name)) +
  labs(title = "Internally Displaced People in Haiti") +
  xlab("") +
  ylab("# of Individuals Displaced") +
  hline

ggplot(data = subset(idps_la, year == 2022),
       mapping = aes(x = name, y = change_internal_dispalcements)) +
  geom_col() +
  hline +
  labs(title = "Change in # of Internally Displaced People due to Conflict") +
  xlab("") +
  ylab("% Change") +
  coord_flip()

ggplot() +
  geom_line(subset(idps, name == "Haiti" & year != 2023),
            mapping = aes(x = year, y = change_internal_dispalcements,
                          group = name, color = name))


# crime stats
crime <- read_csv("data/haiti_crime_stats.csv") %>%
  pivot_longer(col = c(grep("x", colnames(.))),
               names_to = "year", values_to = "count") %>%
  mutate(year = as.numeric(str_extract(year, "[0-9]+")))

