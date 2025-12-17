import { generateSalt } from "../src/utils/v1";
import { prisma } from "../src/orm/v1";


const freelances = [
  {
    name: "Alice Dev",
    email: "alice.dev@gmail.com",
    tjm: 500,
    skills: ["React", "TypeScript", "Tailwind"],
  },
  {
    name: "Bob Design",
    email: "bob.design@creative.com",
    tjm: 450,
    skills: ["Figma", "UI/UX", "Adobe XD"],
  },
  {
    name: "Charlie Data",
    email: "charlie.data@analytics.io",
    tjm: 650,
    skills: ["Python", "SQL", "Machine Learning"],
  },
  {
    name: "David Ops",
    email: "david.ops@cloud.net",
    tjm: 700,
    skills: ["AWS", "Docker", "Kubernetes"],
  },
  {
    name: "Eve Mobile",
    email: "eve.mobile@app.com",
    tjm: 550,
    skills: ["Flutter", "Dart", "iOS"],
  },
  {
    name: "Frank Security",
    email: "frank.sec@cyber.org",
    tjm: 800,
    skills: ["Pentesting", "Cybersecurity", "Audit"],
  },
  {
    name: "Grace Manager",
    email: "grace.pm@agile.com",
    tjm: 600,
    skills: ["Scrum", "Agile", "Jira"],
  },
  {
    name: "Hugo Backend",
    email: "hugo.java@enterprise.com",
    tjm: 580,
    skills: ["Java", "Spring Boot", "Hibernate"],
  },
  {
    name: "Inès Frontend",
    email: "ines.vue@web.fr",
    tjm: 480,
    skills: ["Vue.js", "Nuxt", "Tailwind"],
  },
];

const enterprises = [
  {
    name: "TechCorp",
    sector: "IT Services",
    projects: [
      {
        title: "Refonte Site Web Corporate",
        description: "Modernisation de notre vitrine web avec React.",
        maxTjm: 550,
        requiredSkills: ["React", "TypeScript", "Tailwind"],
      },
    ],
  },
  {
    name: "FinBank",
    sector: "Finance",
    projects: [
      {
        title: "Audit de Sécurité Bancaire",
        description: "Test d'intrusion sur notre nouvelle application mobile.",
        maxTjm: 850,
        requiredSkills: ["Cybersecurity", "Pentesting"],
      },
    ],
  },
  {
    name: "GreenEnergy",
    sector: "Energy",
    projects: [
      {
        title: "Dashboard Consommation",
        description: "Visualisation des données énergétiques en temps réel.",
        maxTjm: 680,
        requiredSkills: ["Python", "Data Viz", "SQL"],
      },
    ],
  },
  {
    name: "HealthPlus",
    sector: "Healthcare",
    projects: [
      {
        title: "App Suivi Patient",
        description: "Application mobile pour le suivi post-opératoire.",
        maxTjm: 600,
        requiredSkills: ["Flutter", "API REST"],
      },
    ],
  },
  {
    name: "RetailKing",
    sector: "Retail",
    projects: [
      {
        title: "Migration Cloud AWS",
        description: "Migration de nos serveurs legacy vers le cloud.",
        maxTjm: 750,
        requiredSkills: ["AWS", "Terraform", "DevOps"],
      },
    ],
  },
  {
    name: "AutoDrive",
    sector: "Automotive",
    projects: [
      {
        title: "Système Embarqué V2",
        description: "Optimisation du logiciel de bord.",
        maxTjm: 900,
        requiredSkills: ["C++", "Embedded Systems"],
      },
    ],
  },
  {
    name: "MediaStream",
    sector: "Media",
    projects: [
      {
        title: "API Streaming Vidéo",
        description: "Backend haute performance pour le streaming.",
        maxTjm: 650,
        requiredSkills: ["Node.js", "Redis", "Microservices"],
      },
    ],
  },
  {
    name: "EduLearn",
    sector: "Education",
    projects: [
      {
        title: "Plateforme E-learning",
        description: "Développement de modules interactifs pour étudiants.",
        maxTjm: 500,
        requiredSkills: ["Vue.js", "PHP", "Laravel"],
      },
    ],
  },
  {
    name: "LogiTrans",
    sector: "Logistics",
    projects: [
      {
        title: "Algorithme d'Optimisation",
        description: "Optimisation des tournées de livraison par IA.",
        maxTjm: 700,
        requiredSkills: ["Python", "Machine Learning", "Algorithms"],
      },
    ],
  },
];

async function main() {
  for (const freelance of freelances) {
    const salt = await generateSalt()
    await prisma.freelance.create({
      data: { ...freelance, salt }
    })
  }
  for (const enterprise of enterprises) {
    const { projects, ...enterpriseData } = enterprise
    const salt = await generateSalt()
    await prisma.enterprise.create({
      data: {
        ...enterpriseData,
        salt: salt,
        projects: {
          create: projects
        }
      }
    })
  }
}

main()
  .catch((e) => {
    console.error('❌: ', e)
    process.exit(1)
  })
  .finally(async () => {
  await prisma.$disconnect()
})
