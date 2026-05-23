import { z } from 'zod';
import type { SystemModel } from '../types';

export const DemoModel: SystemModel = {
  mission: {
    id: 'MIS-SAT-OBS-001',
    type: 'mission',
    name: 'Satélite Brasileiro de Observação e Monitoramento Ambiental – SBOMA-1',
    description:
      'Satélite em órbita heliosíncrona de 650 km para observação e monitoramento ambiental do território brasileiro, fornecendo imagens de alta resolução para aplicações em agricultura, floresta, recursos hídricos e desastres naturais.',
    objectiveIds: ['OBJ-IMAGING', 'OBJ-OPERATIONS', 'OBJ-SCIENCE']
  },
  objectives: [
    {
      id: 'OBJ-IMAGING',
      type: 'objective',
      name: 'Adquirir imagens de alta resolução do território brasileiro',
      description:
        'Capturar dados de imagem com resolução de 5 metros (pancromático) e 20 metros (multiespectral) para monitoramento de uso e cobertura do solo.',
      missionId: 'MIS-SAT-OBS-001',
      requirementIds: [
        'REQ-GSD-PAN',
        'REQ-GSD-MS',
        'REQ-RADIOMETRIC',
        'REQ-TEMPORAL'
      ]
    },
    {
      id: 'OBJ-OPERATIONS',
      type: 'objective',
      name: 'Manter operação confiável por mínimo 5 anos',
      description:
        'Garantir continuidade operacional do satélite e seus subsistemas com disponibilidade de 95% no período de vida útil.',
      missionId: 'MIS-SAT-OBS-001',
      requirementIds: ['REQ-RELIABILITY', 'REQ-POWER', 'REQ-THERMAL']
    },
    {
      id: 'OBJ-SCIENCE',
      type: 'objective',
      name: 'Fornecer dados para pesquisa climática e ambiental',
      description:
        'Disponibilizar dados de observação da Terra para pesquisadores, universidades e órgãos governamentais.',
      missionId: 'MIS-SAT-OBS-001',
      requirementIds: ['REQ-DATA-ARCHIVE', 'REQ-CALIBRATION']
    }
  ],
  requirements: [
    {
      id: 'REQ-GSD-PAN',
      type: 'requirement',
      name: 'Resolução espacial pancromática: 5 m',
      description: 'A câmera pancromática deve atingir 5 metros de resolução no nadir.',
      objectiveId: 'OBJ-IMAGING',
      functionIds: ['FUN-ACQUIRE-PAN', 'FUN-FOCUS-OPTICS']
    },
    {
      id: 'REQ-GSD-MS',
      type: 'requirement',
      name: 'Resolução espacial multiespectral: 20 m',
      description: 'O sensor multiespectral deve atingir 20 metros de resolução em 6 bandas.',
      objectiveId: 'OBJ-IMAGING',
      functionIds: ['FUN-ACQUIRE-MS', 'FUN-CALIBRATE-BANDS']
    },
    {
      id: 'REQ-RADIOMETRIC',
      type: 'requirement',
      name: 'Precisão radiométrica 8 bits',
      description: 'Quantização mínima de 8 bits com radiometria radiométrica precisa.',
      objectiveId: 'OBJ-IMAGING',
      functionIds: ['FUN-DIGITALIZE-SIGNAL']
    },
    {
      id: 'REQ-TEMPORAL',
      type: 'requirement',
      name: 'Cobertura temporal: 16 dias',
      description: 'Repetição de cobertura de uma mesma área em máximo 16 dias (órbita heliosíncrona).',
      objectiveId: 'OBJ-IMAGING',
      functionIds: ['FUN-SCHEDULE-PASS', 'FUN-MANAGE-ATTITUDE']
    },
    {
      id: 'REQ-RELIABILITY',
      type: 'requirement',
      name: 'Confiabilidade: MTBF ≥ 3 anos',
      description: 'Tempo médio entre falhas de pelo menos 3 anos para subsistemas críticos.',
      objectiveId: 'OBJ-OPERATIONS',
      functionIds: ['FUN-MONITOR-HEALTH', 'FUN-FAULT_TOLERANCE']
    },
    {
      id: 'REQ-POWER',
      type: 'requirement',
      name: 'Geração de energia: 1500 W médio',
      description: 'Geração média de 1500 W em eclipse e 2500 W em daylight.',
      objectiveId: 'OBJ-OPERATIONS',
      functionIds: ['FUN-GEN-SOLAR', 'FUN-STORE-ENERGY']
    },
    {
      id: 'REQ-THERMAL',
      type: 'requirement',
      name: 'Controle térmico: 15°C ± 10°C',
      description: 'Manutenção da temperatura de eletrônicos dentro de 15°C ± 10°C.',
      objectiveId: 'OBJ-OPERATIONS',
      functionIds: ['FUN-DISSIPATE-HEAT', 'FUN-REGULATE_TEMP']
    },
    {
      id: 'REQ-DATA-ARCHIVE',
      type: 'requirement',
      name: 'Armazenamento: 500 GB de órbita',
      description: 'Capacidade de armazenar 500 GB de dados brutos antes de downlink.',
      objectiveId: 'OBJ-SCIENCE',
      functionIds: ['FUN-STORE-DATA', 'FUN-COMPRESS-IMAGE']
    },
    {
      id: 'REQ-CALIBRATION',
      type: 'requirement',
      name: 'Calibração geométrica sub-pixel',
      description: 'Erro geométrico máximo de 0.5 pixels após georreferenciamento.',
      objectiveId: 'OBJ-SCIENCE',
      functionIds: ['FUN-GEO-REFERENCE', 'FUN-VALIDATE-CALIB']
    }
  ],
  functions: [
    {
      id: 'FUN-ACQUIRE-PAN',
      type: 'function',
      name: 'Adquirir dados pancromáticos',
      description: 'Operação do sensor pancromático durante passes de imaging.',
      requirementIds: ['REQ-GSD-PAN'],
      systemIds: ['SYS-PAYLOAD']
    },
    {
      id: 'FUN-ACQUIRE-MS',
      type: 'function',
      name: 'Adquirir dados multiespectrais',
      description: 'Operação simultânea dos 6 detectores multiespectrais.',
      requirementIds: ['REQ-GSD-MS'],
      systemIds: ['SYS-PAYLOAD']
    },
    {
      id: 'FUN-FOCUS-OPTICS',
      type: 'function',
      name: 'Foco óptico automático',
      description: 'Ajuste fino do foco da óptica em resposta à temperatura.',
      requirementIds: ['REQ-GSD-PAN'],
      systemIds: ['SYS-PAYLOAD', 'SYS-OBC']
    },
    {
      id: 'FUN-CALIBRATE-BANDS',
      type: 'function',
      name: 'Calibração de bandas espectrais',
      description: 'Ajuste de ganho e offset para cada banda espectral.',
      requirementIds: ['REQ-GSD-MS'],
      systemIds: ['SYS-PAYLOAD']
    },
    {
      id: 'FUN-DIGITALIZE-SIGNAL',
      type: 'function',
      name: 'Digitalização de sinal',
      description: 'Conversão de sinal analógico para 8-bit digital.',
      requirementIds: ['REQ-RADIOMETRIC'],
      systemIds: ['SYS-PAYLOAD', 'SYS-DPE']
    },
    {
      id: 'FUN-SCHEDULE-PASS',
      type: 'function',
      name: 'Agendar passes de imaging',
      description: 'Planejamento de sequências de imagem com órbita prevista.',
      requirementIds: ['REQ-TEMPORAL'],
      systemIds: ['SYS-OBC']
    },
    {
      id: 'FUN-MANAGE-ATTITUDE',
      type: 'function',
      name: 'Controle de atitude',
      description: 'Manter apontamento nadir com precisão de ±0.1°.',
      requirementIds: ['REQ-TEMPORAL'],
      systemIds: ['SYS-AOCS']
    },
    {
      id: 'FUN-MONITOR-HEALTH',
      type: 'function',
      name: 'Monitoramento de saúde do satélite',
      description: 'Detecção e log de anomalias em subsistemas.',
      requirementIds: ['REQ-RELIABILITY'],
      systemIds: ['SYS-OBC']
    },
    {
      id: 'FUN-FAULT_TOLERANCE',
      type: 'function',
      name: 'Tolerância a falhas',
      description: 'Reconfiguração automática em caso de falha de componente.',
      requirementIds: ['REQ-RELIABILITY'],
      systemIds: ['SYS-OBC']
    },
    {
      id: 'FUN-GEN-SOLAR',
      type: 'function',
      name: 'Gerar energia solar',
      description: 'Conversão de irradiância solar em energia elétrica.',
      requirementIds: ['REQ-POWER'],
      systemIds: ['SYS-EPS']
    },
    {
      id: 'FUN-STORE-ENERGY',
      type: 'function',
      name: 'Armazenar energia em bateria',
      description: 'Armazenamento de energia durante eclipse.',
      requirementIds: ['REQ-POWER'],
      systemIds: ['SYS-EPS']
    },
    {
      id: 'FUN-DISSIPATE-HEAT',
      type: 'function',
      name: 'Dissipar calor',
      description: 'Transferência de calor dos eletrônicos para radiadores.',
      requirementIds: ['REQ-THERMAL'],
      systemIds: ['SYS-THERMAL']
    },
    {
      id: 'FUN-REGULATE_TEMP',
      type: 'function',
      name: 'Regular temperatura',
      description: 'Controle ativo e passivo de temperatura.',
      requirementIds: ['REQ-THERMAL'],
      systemIds: ['SYS-THERMAL']
    },
    {
      id: 'FUN-STORE-DATA',
      type: 'function',
      name: 'Armazenar dados de imagem',
      description: 'Gravação de dados brutos em memória de massa.',
      requirementIds: ['REQ-DATA-ARCHIVE'],
      systemIds: ['SYS-DPE']
    },
    {
      id: 'FUN-COMPRESS-IMAGE',
      type: 'function',
      name: 'Comprimir imagem',
      description: 'Compressão JPEG ou wavelet de dados de imagem.',
      requirementIds: ['REQ-DATA-ARCHIVE'],
      systemIds: ['SYS-DPE']
    },
    {
      id: 'FUN-GEO-REFERENCE',
      type: 'function',
      name: 'Georreferenciamento',
      description: 'Aplicação de coordenadas geográficas precisas às imagens.',
      requirementIds: ['REQ-CALIBRATION'],
      systemIds: ['SYS-OBC']
    },
    {
      id: 'FUN-VALIDATE-CALIB',
      type: 'function',
      name: 'Validar calibração',
      description: 'Verificação de precisão geométrica e radiométrica.',
      requirementIds: ['REQ-CALIBRATION'],
      systemIds: ['SYS-OBC']
    }
  ],
  systems: [
    {
      id: 'SYS-PAYLOAD',
      type: 'system',
      name: 'Payload Óptico (PL)',
      description:
        'Sensor óptico de observação da Terra com câmeras pancromática e multiespectral, óptica, eletrônica de leitura.',
      functionIds: [
        'FUN-ACQUIRE-PAN',
        'FUN-ACQUIRE-MS',
        'FUN-FOCUS-OPTICS',
        'FUN-CALIBRATE-BANDS'
      ],
      componentIds: ['CMP-PAN-CAM', 'CMP-MS-CAM', 'CMP-OPTICS', 'CMP-FEE']
    },
    {
      id: 'SYS-DPE',
      type: 'system',
      name: 'Eletrônica de Processamento de Dados (DPE)',
      description: 'Processamento de sinais, compressão, armazenamento de imagens.',
      functionIds: ['FUN-DIGITALIZE-SIGNAL', 'FUN-STORE-DATA', 'FUN-COMPRESS-IMAGE'],
      componentIds: ['CMP-FPGA', 'CMP-SSD', 'CMP-MEMORY']
    },
    {
      id: 'SYS-EPS',
      type: 'system',
      name: 'Subsistema de Energia (EPS)',
      description: 'Geração, armazenamento e distribuição de energia elétrica.',
      functionIds: ['FUN-GEN-SOLAR', 'FUN-STORE-ENERGY'],
      componentIds: ['CMP-SOLAR', 'CMP-BATTERY', 'CMP-PDU', 'CMP-DCDC']
    },
    {
      id: 'SYS-AOCS',
      type: 'system',
      name: 'Sistema de Controle de Atitude e Órbita (AOCS)',
      description: 'Determinação e controle de atitude com reação wheels.',
      functionIds: ['FUN-MANAGE-ATTITUDE'],
      componentIds: ['CMP-STAR-TRACKER', 'CMP-RW', 'CMP-GYRO', 'CMP-MAGNET']
    },
    {
      id: 'SYS-THERMAL',
      type: 'system',
      name: 'Sistema Térmico',
      description: 'Controle passivo e ativo de temperatura.',
      functionIds: ['FUN-DISSIPATE-HEAT', 'FUN-REGULATE_TEMP'],
      componentIds: ['CMP-RADIATOR', 'CMP-HEATER', 'CMP-INSULATION']
    },
    {
      id: 'SYS-OBC',
      type: 'system',
      name: 'Computador de Bordo (OBC)',
      description: 'Processamento de missão, controle de sequência, gerenciamento.',
      functionIds: [
        'FUN-SCHEDULE-PASS',
        'FUN-MONITOR-HEALTH',
        'FUN-FAULT_TOLERANCE',
        'FUN-FOCUS-OPTICS',
        'FUN-GEO-REFERENCE',
        'FUN-VALIDATE-CALIB'
      ],
      componentIds: ['CMP-CPU', 'CMP-ROM', 'CMP-RAM']
    },
    {
      id: 'SYS-TTC',
      type: 'system',
      name: 'Telecomunicações (TT&C)',
      description: 'Telecomando, telemetria e downlink de dados de imagem.',
      functionIds: [],
      componentIds: ['CMP-TX', 'CMP-RX', 'CMP-ANTENNA-TX', 'CMP-ANTENNA-RX']
    },
    {
      id: 'SYS-STRUCTURE',
      type: 'system',
      name: 'Estrutura',
      description: 'Estrutura primária, suporte de cargas, integração mecânica.',
      functionIds: [],
      componentIds: ['CMP-FRAME', 'CMP-PANELS', 'CMP-DEPLOY']
    }
  ],
  components: [
    {
      id: 'CMP-PAN-CAM',
      type: 'component',
      name: 'Câmera Pancromática',
      description: 'Detector CCD 5000×5000 pixels, 5 m resolução no nadir.',
      systemId: 'SYS-PAYLOAD',
      interfaceIds: ['INT-PAN-SIGNAL', 'INT-PL-POWER']
    },
    {
      id: 'CMP-MS-CAM',
      type: 'component',
      name: 'Câmera Multiespectral',
      description: '6 detectores de 2500×2500 pixels cada, 20 m resolução.',
      systemId: 'SYS-PAYLOAD',
      interfaceIds: ['INT-MS-SIGNAL', 'INT-PL-POWER']
    },
    {
      id: 'CMP-OPTICS',
      type: 'component',
      name: 'Óptica Principal',
      description: 'Sistema óptico com espelho e foco ajustável.',
      systemId: 'SYS-PAYLOAD',
      interfaceIds: ['INT-MECH-SUPPORT']
    },
    {
      id: 'CMP-FEE',
      type: 'component',
      name: 'Eletrônica Front-End',
      description: 'Amplificadores, filtros e digitalizadores.',
      systemId: 'SYS-PAYLOAD',
      interfaceIds: ['INT-PAN-SIGNAL', 'INT-MS-SIGNAL', 'INT-PL-POWER']
    },
    {
      id: 'CMP-FPGA',
      type: 'component',
      name: 'FPGA de Processamento',
      description: 'Processamento de sinal em tempo real.',
      systemId: 'SYS-DPE',
      interfaceIds: ['INT-DPE-POWER', 'INT-DPE-DATA']
    },
    {
      id: 'CMP-SSD',
      type: 'component',
      name: 'SSD de 500 GB',
      description: 'Armazenamento de dados brutos de imagem.',
      systemId: 'SYS-DPE',
      interfaceIds: ['INT-DPE-POWER', 'INT-DPE-DATA']
    },
    {
      id: 'CMP-MEMORY',
      type: 'component',
      name: 'Memória DDR3 8 GB',
      description: 'Memória de trabalho para processamento.',
      systemId: 'SYS-DPE',
      interfaceIds: ['INT-DPE-POWER']
    },
    {
      id: 'CMP-SOLAR',
      type: 'component',
      name: 'Painéis Solares',
      description: '2 painéis de 2×2 m, 4 kW de potência.',
      systemId: 'SYS-EPS',
      interfaceIds: ['INT-SOLAR-BUS']
    },
    {
      id: 'CMP-BATTERY',
      type: 'component',
      name: 'Bateria Li-ion',
      description: '2000 Wh para eclipse de 35 min.',
      systemId: 'SYS-EPS',
      interfaceIds: ['INT-BATT-BUS']
    },
    {
      id: 'CMP-PDU',
      type: 'component',
      name: 'Unidade de Distribuição de Energia',
      description: 'Distribuição de potência, proteção, telemetria.',
      systemId: 'SYS-EPS',
      interfaceIds: ['INT-SOLAR-BUS', 'INT-BATT-BUS', 'INT-BUS-28V']
    },
    {
      id: 'CMP-DCDC',
      type: 'component',
      name: 'Conversores DC/DC',
      description: 'Conversão 28V → 12V, 5V, 3.3V.',
      systemId: 'SYS-EPS',
      interfaceIds: ['INT-BUS-28V']
    },
    {
      id: 'CMP-STAR-TRACKER',
      type: 'component',
      name: 'Star Tracker',
      description: 'Sensor de estrelas para determinação de atitude.',
      systemId: 'SYS-AOCS',
      interfaceIds: ['INT-AOCS-POWER', 'INT-AOCS-DATA']
    },
    {
      id: 'CMP-RW',
      type: 'component',
      name: 'Reaction Wheels (3 eixos)',
      description: 'Controle de momentum angular.',
      systemId: 'SYS-AOCS',
      interfaceIds: ['INT-AOCS-POWER', 'INT-AOCS-CTRL']
    },
    {
      id: 'CMP-GYRO',
      type: 'component',
      name: 'Giroscópios (3 eixos)',
      description: 'Sensores de taxa angular.',
      systemId: 'SYS-AOCS',
      interfaceIds: ['INT-AOCS-POWER', 'INT-AOCS-DATA']
    },
    {
      id: 'CMP-MAGNET',
      type: 'component',
      name: 'Magnetômetro de Desaturação',
      description: 'Desaturação de momentum using B-dot control.',
      systemId: 'SYS-AOCS',
      interfaceIds: ['INT-AOCS-POWER', 'INT-AOCS-CTRL']
    },
    {
      id: 'CMP-RADIATOR',
      type: 'component',
      name: 'Radiador Térm',
      description: 'Dissipação passiva de calor.',
      systemId: 'SYS-THERMAL',
      interfaceIds: []
    },
    {
      id: 'CMP-HEATER',
      type: 'component',
      name: 'Aquecedores Resistivos',
      description: 'Aquecimento controlado para operação em eclipse.',
      systemId: 'SYS-THERMAL',
      interfaceIds: ['INT-THERMAL-POWER']
    },
    {
      id: 'CMP-INSULATION',
      type: 'component',
      name: 'Isolante Térmico (MLI)',
      description: 'Multi-layer insulation para reduzir trocas térmicas.',
      systemId: 'SYS-THERMAL',
      interfaceIds: []
    },
    {
      id: 'CMP-CPU',
      type: 'component',
      name: 'CPU de Missão',
      description: 'Processador RAD750 space-rated.',
      systemId: 'SYS-OBC',
      interfaceIds: ['INT-OBC-POWER', 'INT-OBC-DATA']
    },
    {
      id: 'CMP-ROM',
      type: 'component',
      name: 'ROM (512 MB)',
      description: 'Armazenamento de firmware e software.',
      systemId: 'SYS-OBC',
      interfaceIds: ['INT-OBC-POWER']
    },
    {
      id: 'CMP-RAM',
      type: 'component',
      name: 'RAM (2 GB)',
      description: 'Memória de trabalho do OBC.',
      systemId: 'SYS-OBC',
      interfaceIds: ['INT-OBC-POWER']
    },
    {
      id: 'CMP-TX',
      type: 'component',
      name: 'Transmissor S-banda',
      description: '50 W, frequência 2210-2290 MHz.',
      systemId: 'SYS-TTC',
      interfaceIds: ['INT-TTC-POWER', 'INT-TTC-DATA']
    },
    {
      id: 'CMP-RX',
      type: 'component',
      name: 'Receptor S-banda',
      description: 'Recepção de telecomandos.',
      systemId: 'SYS-TTC',
      interfaceIds: ['INT-TTC-POWER', 'INT-TTC-DATA']
    },
    {
      id: 'CMP-ANTENNA-TX',
      type: 'component',
      name: 'Antena Transmissora',
      description: 'Antena helicoidal para downlink.',
      systemId: 'SYS-TTC',
      interfaceIds: []
    },
    {
      id: 'CMP-ANTENNA-RX',
      type: 'component',
      name: 'Antena Receptora',
      description: 'Antena dipolo para uplink.',
      systemId: 'SYS-TTC',
      interfaceIds: []
    },
    {
      id: 'CMP-FRAME',
      type: 'component',
      name: 'Quadro Principal',
      description: 'Estrutura primária de alumínio.',
      systemId: 'SYS-STRUCTURE',
      interfaceIds: ['INT-MECH-SUPPORT']
    },
    {
      id: 'CMP-PANELS',
      type: 'component',
      name: 'Painéis Laterais',
      description: 'Painéis de cobertura e radiação.',
      systemId: 'SYS-STRUCTURE',
      interfaceIds: ['INT-MECH-SUPPORT']
    },
    {
      id: 'CMP-DEPLOY',
      type: 'component',
      name: 'Mecanismo de Desdobramento',
      description: 'Desdobramento de painéis e antenas.',
      systemId: 'SYS-STRUCTURE',
      interfaceIds: []
    }
  ],
  interfaces: [
    {
      id: 'INT-PAN-SIGNAL',
      type: 'interface',
      name: 'Sinal Pancromático',
      description: 'Transferência de dados brutos do detector pancromático.',
      sourceId: 'CMP-PAN-CAM',
      targetId: 'CMP-FEE'
    },
    {
      id: 'INT-MS-SIGNAL',
      type: 'interface',
      name: 'Sinal Multiespectral',
      description: 'Transferência de dados dos 6 detectores multiespectrais.',
      sourceId: 'CMP-MS-CAM',
      targetId: 'CMP-FEE'
    },
    {
      id: 'INT-PL-POWER',
      type: 'interface',
      name: 'Alimentação do Payload',
      description: 'Distribuição de 28V e 5V ao payload.',
      sourceId: 'CMP-PDU',
      targetId: 'CMP-PAN-CAM'
    },
    {
      id: 'INT-DPE-DATA',
      type: 'interface',
      name: 'Fluxo de Dados DPE',
      description: 'Interface de dados entre processador, memória e armazenamento.',
      sourceId: 'CMP-FPGA',
      targetId: 'CMP-SSD'
    },
    {
      id: 'INT-DPE-POWER',
      type: 'interface',
      name: 'Alimentação DPE',
      description: 'Potência 5V/3.3V para componentes DPE.',
      sourceId: 'CMP-DCDC',
      targetId: 'CMP-FPGA'
    },
    {
      id: 'INT-SOLAR-BUS',
      type: 'interface',
      name: 'Barramento Solar',
      description: 'Saída dos painéis solares até PDU.',
      sourceId: 'CMP-SOLAR',
      targetId: 'CMP-PDU'
    },
    {
      id: 'INT-BATT-BUS',
      type: 'interface',
      name: 'Barramento de Bateria',
      description: 'Conexão da bateria ao PDU.',
      sourceId: 'CMP-BATTERY',
      targetId: 'CMP-PDU'
    },
    {
      id: 'INT-BUS-28V',
      type: 'interface',
      name: 'Bus Primário 28V',
      description: 'Distribuição primária de 28V para todo o satélite.',
      sourceId: 'CMP-PDU',
      targetId: 'CMP-DCDC'
    },
    {
      id: 'INT-AOCS-POWER',
      type: 'interface',
      name: 'Alimentação AOCS',
      description: 'Potência para sensores e atuadores AOCS.',
      sourceId: 'CMP-DCDC',
      targetId: 'CMP-RW'
    },
    {
      id: 'INT-AOCS-DATA',
      type: 'interface',
      name: 'Dados AOCS',
      description: 'Telemetria de Star Tracker e giroscópios para OBC.',
      sourceId: 'CMP-STAR-TRACKER',
      targetId: 'CMP-CPU'
    },
    {
      id: 'INT-AOCS-CTRL',
      type: 'interface',
      name: 'Controle AOCS',
      description: 'Comandos de controle para Reaction Wheels.',
      sourceId: 'CMP-CPU',
      targetId: 'CMP-RW'
    },
    {
      id: 'INT-THERMAL-POWER',
      type: 'interface',
      name: 'Alimentação Térmica',
      description: 'Potência para aquecedores durante eclipse.',
      sourceId: 'CMP-DCDC',
      targetId: 'CMP-HEATER'
    },
    {
      id: 'INT-OBC-POWER',
      type: 'interface',
      name: 'Alimentação OBC',
      description: 'Potência 5V/3.3V para computador de bordo.',
      sourceId: 'CMP-DCDC',
      targetId: 'CMP-CPU'
    },
    {
      id: 'INT-OBC-DATA',
      type: 'interface',
      name: 'Bus de Dados OBC',
      description: 'Interface de dados entre CPU, memória e periféricos.',
      sourceId: 'CMP-CPU',
      targetId: 'CMP-ROM'
    },
    {
      id: 'INT-TTC-POWER',
      type: 'interface',
      name: 'Alimentação TT&C',
      description: 'Potência para transmissor e receptor.',
      sourceId: 'CMP-DCDC',
      targetId: 'CMP-TX'
    },
    {
      id: 'INT-TTC-DATA',
      type: 'interface',
      name: 'Dados Downlink',
      description: 'Fluxo de dados de imagem para transmissão.',
      sourceId: 'CMP-SSD',
      targetId: 'CMP-TX'
    },
    {
      id: 'INT-MECH-SUPPORT',
      type: 'interface',
      name: 'Suporte Mecânico',
      description: 'Integração mecânica de payload com estrutura.',
      sourceId: 'CMP-FRAME',
      targetId: 'CMP-OPTICS'
    }
  ],
  budgets: [
    {
      id: 'BUD-POWER',
      type: 'budget',
      name: 'Budget de Energia Média',
      description: 'Potência média do satélite em órbita incluindo eclipse.',
      relatedIds: ['REQ-POWER', 'SYS-EPS', 'SYS-PAYLOAD'],
      allocated: '1500 W',
      consumed: '1380 W'
    },
    {
      id: 'BUD-MASS',
      type: 'budget',
      name: 'Budget de Massa Seca',
      description: 'Massa total do satélite sem propelente.',
      relatedIds: ['SYS-STRUCTURE', 'SYS-PAYLOAD', 'SYS-EPS'],
      allocated: '1800 kg',
      consumed: '1650 kg'
    },
    {
      id: 'BUD-THERMAL',
      type: 'budget',
      name: 'Budget Térmico',
      description: 'Dissipação máxima de calor em operação nominal.',
      relatedIds: ['REQ-THERMAL', 'SYS-THERMAL'],
      allocated: '600 W',
      consumed: '520 W'
    },
    {
      id: 'BUD-DATA',
      type: 'budget',
      name: 'Budget de Dados por Órbita',
      description: 'Capacidade de armazenamento antes de downlink.',
      relatedIds: ['REQ-DATA-ARCHIVE', 'SYS-DPE'],
      allocated: '500 GB',
      consumed: '420 GB'
    }
  ],
  risks: [
    {
      id: 'RISK-DEGRADE',
      type: 'risk',
      name: 'Degradação de Painéis Solares',
      description: 'Redução de eficiência solar por dano de radiação em órbita.',
      relatedIds: ['CMP-SOLAR', 'REQ-POWER'],
      probability: 'Média',
      impact: 'Alto',
      mitigation: 'Seleção de células resistentes a radiação; cobertura com vidro protetivo.'
    },
    {
      id: 'RISK-FOCAL',
      type: 'risk',
      name: 'Desalinhamento Focal',
      description: 'Perda de foco óptico por flutuação térmica extrema.',
      relatedIds: ['CMP-OPTICS', 'REQ-GSD-PAN'],
      probability: 'Baixa',
      impact: 'Alto',
      mitigation: 'Sistema de foco automático redundante; controle de temperatura rigoroso.'
    },
    {
      id: 'RISK-RWFAIL',
      type: 'risk',
      name: 'Falha de Reaction Wheel',
      description: 'Perda de capacidade de controle de atitude.',
      relatedIds: ['CMP-RW', 'FUN-MANAGE-ATTITUDE'],
      probability: 'Baixa',
      impact: 'Crítico',
      mitigation: '3 RWs em configuração redundante; modo de controle degradado com magnets.'
    },
    {
      id: 'RISK-COMM-LOSS',
      type: 'risk',
      name: 'Perda Prolongada de Comunicação',
      description: 'Falha de subsistema de comunicação durante contato.',
      relatedIds: ['CMP-TX', 'SYS-TTC'],
      probability: 'Baixa',
      impact: 'Alto',
      mitigation: 'Redundância de transmissor e receptor; teste de link budget pré-lançamento.'
    },
    {
      id: 'RISK-THERMAL-RUNAWAY',
      type: 'risk',
      name: 'Fuga Térmica em Bateria',
      description: 'Aquecimento descontrolado de bateria em situação de falta.',
      relatedIds: ['CMP-BATTERY', 'REQ-THERMAL'],
      probability: 'Muito Baixa',
      impact: 'Crítico',
      mitigation: 'Fusíveis de proteção; isolação térmica; monitoramento contínuo de temperatura.'
    }
  ],
  verifications: [
    {
      id: 'VER-GSD-OPTICAL',
      type: 'verification',
      name: 'Teste de Resolução Óptica',
      description: 'Verificação de GSD pancromático de 5 m e multiespectral de 20 m.',
      requirementId: 'REQ-GSD-PAN',
      itemId: 'CMP-PAN-CAM',
      method: 'Test',
      evidence: 'Imagens de alvo calibrado em câmara de vácuo thermal.',
      status: 'Planned'
    },
    {
      id: 'VER-THERMAL-VAC',
      type: 'verification',
      name: 'Teste Térmica em Vácuo',
      description: 'Validação de controle térmico em ambiente espacial simulado.',
      requirementId: 'REQ-THERMAL',
      itemId: 'SYS-THERMAL',
      method: 'Test',
      evidence: 'Telemetria de temperatura durante ciclos hot/cold.',
      status: 'In Progress'
    },
    {
      id: 'VER-POWER-BUDGET',
      type: 'verification',
      name: 'Análise de Budget de Potência',
      description: 'Verificação analítica de consumo de potência média em órbita.',
      requirementId: 'REQ-POWER',
      itemId: 'SYS-EPS',
      method: 'Analysis',
      evidence: 'Simulação de link budget e consumo de subsistemas.',
      status: 'Completed'
    },
    {
      id: 'VER-RELIABILITY-FMEA',
      type: 'verification',
      name: 'Análise FMEA de Confiabilidade',
      description: 'Failure Mode and Effects Analysis para MTBF ≥ 3 anos.',
      requirementId: 'REQ-RELIABILITY',
      itemId: 'SYS-OBC',
      method: 'Analysis',
      evidence: 'Documento FMEA com mitigações propostas.',
      status: 'In Progress'
    }
  ],
  traceLinks: [
    {
      id: 'TRL-001',
      from: 'MIS-SAT-OBS-001',
      to: 'OBJ-IMAGING',
      description: 'Missão requer objetivo de alta resolução.'
    },
    {
      id: 'TRL-002',
      from: 'OBJ-IMAGING',
      to: 'REQ-GSD-PAN',
      description: 'Objetivo derivado em requisito de resolução pancromática.'
    },
    {
      id: 'TRL-003',
      from: 'REQ-GSD-PAN',
      to: 'FUN-ACQUIRE-PAN',
      description: 'Requisito atribuído a função de aquisição.'
    },
    {
      id: 'TRL-004',
      from: 'FUN-ACQUIRE-PAN',
      to: 'SYS-PAYLOAD',
      description: 'Função implementada pelo sistema de payload.'
    },
    {
      id: 'TRL-005',
      from: 'SYS-PAYLOAD',
      to: 'CMP-PAN-CAM',
      description: 'Payload composto pela câmera pancromática.'
    },
    {
      id: 'TRL-006',
      from: 'CMP-PAN-CAM',
      to: 'INT-PAN-SIGNAL',
      description: 'Câmera conectada via interface de sinal.'
    },
    {
      id: 'TRL-007',
      from: 'OBJ-OPERATIONS',
      to: 'REQ-RELIABILITY',
      description: 'Objetivo operacional derivado em requisito MTBF.'
    },
    {
      id: 'TRL-008',
      from: 'REQ-RELIABILITY',
      to: 'FUN-MONITOR-HEALTH',
      description: 'Requisito atribuído a monitoramento de saúde.'
    },
    {
      id: 'TRL-009',
      from: 'OBJ-OPERATIONS',
      to: 'REQ-POWER',
      description: 'Operação contínua requer geração adequada de energia.'
    },
    {
      id: 'TRL-010',
      from: 'REQ-POWER',
      to: 'SYS-EPS',
      description: 'Requisito alocado ao sistema de energia.'
    }
  ]
};

// Zod Schemas (validação)
const BaseSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  description: z.string()
});

const MissionSchema = BaseSchema.extend({
  type: z.literal('mission'),
  objectiveIds: z.array(z.string())
});

const ObjectiveSchema = BaseSchema.extend({
  type: z.literal('objective'),
  missionId: z.string(),
  requirementIds: z.array(z.string())
});

const RequirementSchema = BaseSchema.extend({
  type: z.literal('requirement'),
  objectiveId: z.string(),
  functionIds: z.array(z.string())
});

const FunctionSchema = BaseSchema.extend({
  type: z.literal('function'),
  requirementIds: z.array(z.string()),
  systemIds: z.array(z.string())
});

const SystemSchema = BaseSchema.extend({
  type: z.literal('system'),
  functionIds: z.array(z.string()),
  componentIds: z.array(z.string())
});

const ComponentSchema = BaseSchema.extend({
  type: z.literal('component'),
  systemId: z.string(),
  interfaceIds: z.array(z.string())
});

const InterfaceSchema = BaseSchema.extend({
  type: z.literal('interface'),
  sourceId: z.string(),
  targetId: z.string()
});

const BudgetSchema = BaseSchema.extend({
  type: z.literal('budget'),
  relatedIds: z.array(z.string()),
  allocated: z.string(),
  consumed: z.string()
});

const RiskSchema = BaseSchema.extend({
  type: z.literal('risk'),
  relatedIds: z.array(z.string()),
  probability: z.string(),
  impact: z.string(),
  mitigation: z.string()
});

const VerificationSchema = BaseSchema.extend({
  type: z.literal('verification'),
  requirementId: z.string(),
  itemId: z.string(),
  method: z.string(),
  evidence: z.string(),
  status: z.string()
});

const TraceLinkSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  description: z.string()
});

export const modelSchema = z.object({
  mission: MissionSchema,
  objectives: z.array(ObjectiveSchema),
  requirements: z.array(RequirementSchema),
  functions: z.array(FunctionSchema),
  systems: z.array(SystemSchema),
  components: z.array(ComponentSchema),
  interfaces: z.array(InterfaceSchema),
  budgets: z.array(BudgetSchema),
  risks: z.array(RiskSchema),
  verifications: z.array(VerificationSchema),
  traceLinks: z.array(TraceLinkSchema)
});
