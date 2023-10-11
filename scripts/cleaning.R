library(tidyverse)
library(readxl)
library(ICplots)
library(jsonlite)

theme_set(theme_ic())
options(scipen=999)

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

pop <- read_csv("data/WBpop22.csv") %>% rename(pop = YR2022)
idps_la <- left_join(idps_la, pop, by = c('name' = 'CountryName')) 
idps_la <- idps_la%>%
  mutate(percent_idp = ifelse(is.na(idps_la$conflict_internal_displacements), NA,
         (idps_la$conflict_internal_displacements / idps_la$pop * 100)))

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

# Hunger data for tree plot
hunger <- read_csv("data/ipc_haiti - Count.csv")
hungerJSON <- toJSON(hunger)
hungerJSON


# Sexual Violence
acled_sc <- read_csv("data/acledHaiti-19_23.csv") %>%
  filter(grepl("sexual violence", tags))

# Cholera
chol_con <- read_xlsx("data/Haiti_cholera.xlsx", sheet = 1) %>%
  mutate(Age = sub("--", "-", Age))
#write_csv(chol_con, "data/cholera_confirmed.csv")

chol_sus <- read_xlsx("data/Haiti_cholera.xlsx", sheet = 2) %>%
  mutate(Age = sub("--", "-", Age)) 
#write_csv(chol_sus, "data/cholera_suspected.csv")
