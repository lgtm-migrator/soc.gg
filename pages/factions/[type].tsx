import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Grid, Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { FactionDTO, getFaction, getFactions } from "../../lib/factions";
import PopoverLink from "../../components/PopoverLink/PopoverLink";
import Head from "next/head";

const Faction: NextPage<{ faction: FactionDTO; terms: TermsDTO }> = ({
  faction,
  terms,
}) => {
  return (
    <>
      <Head>
        <title>{faction.name} - SoC.gg</title>
        <meta
          name="description"
          content={`${faction.name} faction details of Songs of Conquest`}
        />
      </Head>
      <Stack>
        <Title order={4}>{faction.name}</Title>
        <SpriteSheet spriteSheet={faction.bannerSprite} />
        {faction.symbolSprite && (
          <SpriteSheet spriteSheet={faction.symbolSprite} />
        )}
        <Text size="sm">{faction.description}</Text>
        <Title order={5}>{terms.wielders}</Title>
        <Grid mt="md">
          {faction.commanders.map((commander) => (
            <Grid.Col key={commander.type} sx={{ flexBasis: "auto" }}>
              {commander.portrait && (
                <PopoverLink
                  href={`/wielders/${commander.type}`}
                  popover={
                    <>
                      <Title order={4}>{commander.name}</Title>
                      <Text size="sm">{commander.description}</Text>
                    </>
                  }
                >
                  <SpriteSheet spriteSheet={commander.portrait} />
                </PopoverLink>
              )}
            </Grid.Col>
          ))}
        </Grid>
        <Title order={5}>{terms.units}</Title>

        <Grid mt="md">
          {faction.units.map((unit) => (
            <Grid.Col key={unit.vanilla.languageKey} sx={{ flexBasis: "auto" }}>
              <PopoverLink
                href={`/units/${unit.vanilla.languageKey}`}
                popover={
                  <>
                    <Title order={4}>{unit.vanilla.name}</Title>
                    <Text size="sm">{unit.vanilla.description}</Text>
                  </>
                }
              >
                <SpriteSheet spriteSheet={unit.vanilla.sprite} />
              </PopoverLink>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </>
  );
};

export default Faction;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const faction = getFaction(type, context.locale!);
  if (!faction) {
    return {
      notFound: true,
    };
  }
  const terms: TermsDTO = {
    wielders: getTerm("Common/Wielders", context.locale!),
    units: getTerm("Tutorial/CodexCategory/Units", context.locale!),
  };

  return {
    props: {
      faction,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const factions = getFactions("en")
    .filter((faction) => faction.symbolSprite)
    .map((faction) => ({
      params: {
        type: faction.type,
      },
    }));

  return {
    paths: factions,
    fallback: "blocking",
  };
};
