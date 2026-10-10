import json
import sqlite3
from typing import Optional
from models import RoadmapPathway, RoadmapStep, RoadmapResource

DB_PATH = "rezum.db"

PATHWAYS_DATA: list[dict] = [
    {
        "id": "distributed-systems",
        "title": "Distributed Systems & Cloud Architecture Pathway",
        "target_role": "Staff Distributed Systems Engineer",
        "description": "Master high-throughput distributed consensus, low-level storage engines, message brokers, and large-scale fault tolerance.",
        "github_source": "donnemartin/system-design-primer",
        "github_url": "https://github.com/donnemartin/system-design-primer",
        "est_weeks": 12,
        "skill_gaps": [
            {"skill": "Consensus Protocols (Raft/Paxos)", "level": "CRITICAL"},
            {"skill": "LSM Trees & Storage Engines", "level": "CRITICAL"},
            {"skill": "Distributed Tracing & eBPF", "level": "HIGH"},
            {"skill": "Chaos Engineering & SLA Resiliency", "level": "MEDIUM"},
            {"skill": "RFC Authorship & Tech Governance", "level": "LOW"}
        ],
        "steps": [
            {
                "num": "01",
                "title": "Systems Design Fundamentals & Data Structures",
                "duration": "3 WEEKS",
                "status": "done",
                "resources": [
                    {
                        "id": "ds-1",
                        "stepNum": "01",
                        "type": "REPO",
                        "title": "The System Design Primer (donnemartin)",
                        "duration": "12 hrs",
                        "hours": 12,
                        "completed": True,
                        "url": "https://github.com/donnemartin/system-design-primer",
                        "repo_name": "donnemartin/system-design-primer",
                        "description": "Comprehensive open-source primer covering scalability, caching, load balancing, and async pipelines."
                    },
                    {
                        "id": "ds-2",
                        "stepNum": "01",
                        "type": "DOCS",
                        "title": "Designing Data-Intensive Applications (DDIA Open Notes)",
                        "duration": "14 hrs",
                        "hours": 14,
                        "completed": True,
                        "url": "https://github.com/ept/ddia-code",
                        "repo_name": "ept/ddia-code",
                        "description": "Martin Kleppmann's companion open-source examples and architecture guides for data-intensive apps."
                    },
                    {
                        "id": "ds-3",
                        "stepNum": "01",
                        "type": "BOOK",
                        "title": "OSSU: Computer Systems Architecture Core",
                        "duration": "10 hrs",
                        "hours": 10,
                        "completed": False,
                        "url": "https://github.com/ossu/computer-science",
                        "repo_name": "ossu/computer-science",
                        "description": "Open Source Society University curriculum module on operating systems and concurrent computation."
                    }
                ]
            },
            {
                "num": "02",
                "title": "Distributed Consensus, Storage & Partitioning",
                "duration": "4 WEEKS",
                "status": "current",
                "resources": [
                    {
                        "id": "ds-4",
                        "stepNum": "02",
                        "type": "RFC",
                        "title": "In Search of an Understandable Consensus Algorithm (Raft Paper)",
                        "duration": "6 hrs",
                        "hours": 6,
                        "completed": True,
                        "url": "https://raft.github.io/",
                        "repo_name": "raft/raft.github.io",
                        "description": "Interactive visualizations and the seminal Stanford Raft paper on leader election and log replication."
                    },
                    {
                        "id": "ds-5",
                        "stepNum": "02",
                        "type": "REPO",
                        "title": "Apache Kafka Source Internals & Log Append Storage",
                        "duration": "16 hrs",
                        "hours": 16,
                        "completed": False,
                        "url": "https://github.com/apache/kafka",
                        "repo_name": "apache/kafka",
                        "description": "Inspect how production partitions, zero-copy socket transfers, and consumer groups are implemented."
                    },
                    {
                        "id": "ds-6",
                        "stepNum": "02",
                        "type": "DOCS",
                        "title": "Papers We Love: Distributed Systems Classics",
                        "duration": "8 hrs",
                        "hours": 8,
                        "completed": False,
                        "url": "https://github.com/papers-we-love/papers-we-love",
                        "repo_name": "papers-we-love/papers-we-love",
                        "description": "Community-curated repository of breakthrough computing papers (Dynamo, Spanner, Chubby, MapReduce)."
                    }
                ]
            },
            {
                "num": "03",
                "title": "Projects: Build, Measure & Ship Under Chaos",
                "duration": "3 WEEKS",
                "status": "pending",
                "resources": [
                    {
                        "id": "ds-7",
                        "stepNum": "03",
                        "type": "COURSE",
                        "title": "Kubernetes The Hard Way (Kelsey Hightower)",
                        "duration": "18 hrs",
                        "hours": 18,
                        "completed": False,
                        "url": "https://github.com/kelseyhightower/kubernetes-the-hard-way",
                        "repo_name": "kelseyhightower/kubernetes-the-hard-way",
                        "description": "Bootstrap a Kubernetes cluster from scratch without automated installers, configuring TLS, etcd, and CNI."
                    },
                    {
                        "id": "ds-8",
                        "stepNum": "03",
                        "type": "REPO",
                        "title": "Chaos Mesh: Chaos Engineering in Cloud Native",
                        "duration": "10 hrs",
                        "hours": 10,
                        "completed": False,
                        "url": "https://github.com/chaos-mesh/chaos-mesh",
                        "repo_name": "chaos-mesh/chaos-mesh",
                        "description": "Test fault injection (network partitions, IO latency, clock skew) against distributed services."
                    }
                ]
            },
            {
                "num": "04",
                "title": "Interview & Governance: System Design & Staff RFCs",
                "duration": "2 WEEKS",
                "status": "pending",
                "resources": [
                    {
                        "id": "ds-9",
                        "stepNum": "04",
                        "type": "DOCS",
                        "title": "Awesome System Design Resources (Ashish Pratap Singh)",
                        "duration": "6 hrs",
                        "hours": 6,
                        "completed": False,
                        "url": "https://github.com/ashishps1/awesome-system-design-resources",
                        "repo_name": "ashishps1/awesome-system-design-resources",
                        "description": "Real architecture deep dives for Netflix, Uber, Twitter, Discord, and WhatsApp."
                    },
                    {
                        "id": "ds-10",
                        "stepNum": "04",
                        "type": "REPO",
                        "title": "Staff Engineer's Path: Design RFC Template Repository",
                        "duration": "4 hrs",
                        "hours": 4,
                        "completed": False,
                        "url": "https://github.com/spotify/pedep",
                        "repo_name": "spotify/pedep",
                        "description": "Open source templates for writing Request For Comments (RFC) engineering documents and architecture reviews."
                    }
                ]
            }
        ]
    },
    {
        "id": "ai-engineering",
        "title": "AI & Machine Learning Infrastructure Pathway",
        "target_role": "Staff AI / ML Platform Engineer",
        "description": "From foundational transformers and GPU memory optimization to high-throughput vLLM serving and distributed model training.",
        "github_source": "kamranahmedse/developer-roadmap",
        "github_url": "https://github.com/kamranahmedse/developer-roadmap",
        "est_weeks": 14,
        "skill_gaps": [
            {"skill": "Transformer Attention & FlashAttention", "level": "CRITICAL"},
            {"skill": "High-Throughput Serving (vLLM / Triton)", "level": "CRITICAL"},
            {"skill": "CUDA & Kernel Optimization", "level": "HIGH"},
            {"skill": "Ray Distributed Orchestration", "level": "HIGH"},
            {"skill": "MLOps & Automated Evals", "level": "MEDIUM"}
        ],
        "steps": [
            {
                "num": "01",
                "title": "Deep Learning Fundamentals & Neural Networks",
                "duration": "3 WEEKS",
                "status": "done",
                "resources": [
                    {
                        "id": "ai-1",
                        "stepNum": "01",
                        "type": "BOOK",
                        "title": "The Deep Learning Book (Goodfellow, Bengio, Courville)",
                        "duration": "14 hrs",
                        "hours": 14,
                        "completed": True,
                        "url": "https://www.deeplearningbook.org/",
                        "repo_name": "goodfellow/deeplearningbook",
                        "description": "The definitive MIT Press text on deep networks, backprop optimization, and linear algebra."
                    },
                    {
                        "id": "ai-2",
                        "stepNum": "01",
                        "type": "COURSE",
                        "title": "Practical Deep Learning for Coders (fast.ai)",
                        "duration": "16 hrs",
                        "hours": 16,
                        "completed": True,
                        "url": "https://github.com/fastai/fastbook",
                        "repo_name": "fastai/fastbook",
                        "description": "Jupyter notebooks and PyTorch code implementing foundational vision and language models."
                    }
                ]
            },
            {
                "num": "02",
                "title": "Modern Transformers & Attention Architectures",
                "duration": "4 WEEKS",
                "status": "current",
                "resources": [
                    {
                        "id": "ai-3",
                        "stepNum": "02",
                        "type": "REPO",
                        "title": "HuggingFace Transformers Course & Implementation",
                        "duration": "12 hrs",
                        "hours": 12,
                        "completed": True,
                        "url": "https://github.com/huggingface/course",
                        "repo_name": "huggingface/course",
                        "description": "Tokenization, fine-tuning, PEFT/LoRA adapters, and multi-GPU pipeline parallelism."
                    },
                    {
                        "id": "ai-4",
                        "stepNum": "02",
                        "type": "RFC",
                        "title": "FlashAttention: Fast & Memory-Efficient Exact Attention",
                        "duration": "8 hrs",
                        "hours": 8,
                        "completed": False,
                        "url": "https://github.com/Dao-AILab/flash-attention",
                        "repo_name": "Dao-AILab/flash-attention",
                        "description": "IO-aware GPU SRAM tiling algorithms that speed up transformer compute by up to 4x."
                    }
                ]
            },
            {
                "num": "03",
                "title": "Production LLM Serving & Model Inference",
                "duration": "4 WEEKS",
                "status": "pending",
                "resources": [
                    {
                        "id": "ai-5",
                        "stepNum": "03",
                        "type": "REPO",
                        "title": "vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention",
                        "duration": "15 hrs",
                        "hours": 15,
                        "completed": False,
                        "url": "https://github.com/vllm-project/vllm",
                        "repo_name": "vllm-project/vllm",
                        "description": "Memory management for continuous batching and KV caching inspired by virtual memory OS pages."
                    },
                    {
                        "id": "ai-6",
                        "stepNum": "03",
                        "type": "DOCS",
                        "title": "Triton Inference Server Documentation & Client Benchmarks",
                        "duration": "10 hrs",
                        "hours": 10,
                        "completed": False,
                        "url": "https://github.com/triton-inference-server/server",
                        "repo_name": "triton-inference-server/server",
                        "description": "NVIDIA's open-source multi-framework inference microservice for GPUs and CPUs."
                    }
                ]
            },
            {
                "num": "04",
                "title": "Distributed Training, Ray & ML Systems Scale",
                "duration": "3 WEEKS",
                "status": "pending",
                "resources": [
                    {
                        "id": "ai-7",
                        "stepNum": "04",
                        "type": "REPO",
                        "title": "Ray: Unified Framework for Scaling AI and Python Workloads",
                        "duration": "12 hrs",
                        "hours": 12,
                        "completed": False,
                        "url": "https://github.com/ray-project/ray",
                        "repo_name": "ray-project/ray",
                        "description": "Ray Core, Ray Train, and Ray Tune architecture for cluster-wide hyperparameter sweeps."
                    }
                ]
            }
        ]
    },
    {
        "id": "cloud-devops",
        "title": "Cloud Native Platform & SRE Pathway",
        "target_role": "Principal Site Reliability & Platform Architect",
        "description": "End-to-end infrastructure automation, multi-cloud networking, zero-trust security, and automated incident resilience.",
        "github_source": "bregman-arie/devops-exercises",
        "github_url": "https://github.com/bregman-arie/devops-exercises",
        "est_weeks": 10,
        "skill_gaps": [
            {"skill": "Terraform Infrastructure as Code", "level": "CRITICAL"},
            {"skill": "Kubernetes Operators & CRDs", "level": "CRITICAL"},
            {"skill": "Prometheus & OpenTelemetry", "level": "HIGH"},
            {"skill": "Zero-Trust Identity (SPIFFE/SPIRE)", "level": "HIGH"},
            {"skill": "GitOps (ArgoCD / Flux)", "level": "MEDIUM"}
        ],
        "steps": [
            {
                "num": "01",
                "title": "Linux Kernel Internals, Networking & Containers",
                "duration": "2 WEEKS",
                "status": "done",
                "resources": [
                    {
                        "id": "cd-1",
                        "stepNum": "01",
                        "type": "REPO",
                        "title": "DevOps Exercises (3000+ SRE Questions & Answers)",
                        "duration": "14 hrs",
                        "hours": 14,
                        "completed": True,
                        "url": "https://github.com/bregman-arie/devops-exercises",
                        "repo_name": "bregman-arie/devops-exercises",
                        "description": "Deep exercises on Linux cgroups, namespaces, TCP/IP tuning, and bash scripting."
                    },
                    {
                        "id": "cd-2",
                        "stepNum": "01",
                        "type": "BOOK",
                        "title": "Google Site Reliability Engineering (SRE) Books",
                        "duration": "12 hrs",
                        "hours": 12,
                        "completed": True,
                        "url": "https://sre.google/books/",
                        "repo_name": "google/sre-books",
                        "description": "Google's free, canonical online textbooks on SLIs, SLOs, error budgets, and postmortems."
                    }
                ]
            },
            {
                "num": "02",
                "title": "Declarative Infrastructure & GitOps Automation",
                "duration": "3 WEEKS",
                "status": "current",
                "resources": [
                    {
                        "id": "cd-3",
                        "stepNum": "02",
                        "type": "REPO",
                        "title": "Terraform Best Practices (Anton Babenko)",
                        "duration": "8 hrs",
                        "hours": 8,
                        "completed": False,
                        "url": "https://github.com/antonbabenko/terraform-best-practices",
                        "repo_name": "antonbabenko/terraform-best-practices",
                        "description": "Production patterns for reusable modules, state locking, Terragrunt, and CI pipelines."
                    },
                    {
                        "id": "cd-4",
                        "stepNum": "02",
                        "type": "DOCS",
                        "title": "Argo CD: Declarative GitOps Continuous Delivery",
                        "duration": "10 hrs",
                        "hours": 10,
                        "completed": False,
                        "url": "https://github.com/argoproj/argo-cd",
                        "repo_name": "argoproj/argo-cd",
                        "description": "Automated syncing of Kubernetes manifests from Git repositories with health checks."
                    }
                ]
            },
            {
                "num": "03",
                "title": "Observability: OpenTelemetry & Prometheus",
                "duration": "3 WEEKS",
                "status": "pending",
                "resources": [
                    {
                        "id": "cd-5",
                        "stepNum": "03",
                        "type": "REPO",
                        "title": "OpenTelemetry Collector & Instrumentation",
                        "duration": "12 hrs",
                        "hours": 12,
                        "completed": False,
                        "url": "https://github.com/open-telemetry/opentelemetry-collector",
                        "repo_name": "open-telemetry/opentelemetry-collector",
                        "description": "Vendor-agnostic telemetry ingestion pipeline for metrics, logs, and distributed traces."
                    }
                ]
            },
            {
                "num": "04",
                "title": "Service Mesh & Zero Trust Security",
                "duration": "2 WEEKS",
                "status": "pending",
                "resources": [
                    {
                        "id": "cd-6",
                        "stepNum": "04",
                        "type": "REPO",
                        "title": "Cilium: eBPF-based Networking, Observability & Security",
                        "duration": "10 hrs",
                        "hours": 10,
                        "completed": False,
                        "url": "https://github.com/cilium/cilium",
                        "repo_name": "cilium/cilium",
                        "description": "High-performance Linux kernel eBPF datapath replacing iptables for Kubernetes CNI."
                    }
                ]
            }
        ]
    }
]


def get_all_pathways() -> list[RoadmapPathway]:
    pathways = []
    for p in PATHWAYS_DATA:
        steps = []
        for s in p["steps"]:
            resources = [RoadmapResource(**r) for r in s["resources"]]
            steps.append(RoadmapStep(
                num=s["num"],
                title=s["title"],
                duration=s["duration"],
                status=s["status"],
                resources=resources
            ))
        pathways.append(RoadmapPathway(
            id=p["id"],
            title=p["title"],
            target_role=p["target_role"],
            description=p["description"],
            github_source=p["github_source"],
            github_url=p["github_url"],
            est_weeks=p["est_weeks"],
            skill_gaps=p["skill_gaps"],
            steps=steps
        ))
    return pathways


def get_pathway_by_id(pathway_id: str, user_id: Optional[int] = None) -> Optional[RoadmapPathway]:
    matched = None
    for p in PATHWAYS_DATA:
        if p["id"] == pathway_id:
            matched = p
            break
    if not matched:
        matched = PATHWAYS_DATA[0]  # default to distributed systems

    completed_ids = set()
    if user_id:
        conn = sqlite3.connect(DB_PATH)
        row = conn.execute("SELECT completed_resources FROM user_roadmaps WHERE user_id = ? AND pathway_id = ?",
                           (user_id, matched["id"])).fetchone()
        conn.close()
        if row and row[0]:
            try:
                completed_ids = set(json.loads(row[0]))
            except Exception:
                pass

    steps = []
    for s in matched["steps"]:
        resources = []
        for r in s["resources"]:
            is_comp = r["id"] in completed_ids if user_id and completed_ids else r["completed"]
            resources.append(RoadmapResource(
                id=r["id"],
                stepNum=r["stepNum"],
                type=r["type"],
                title=r["title"],
                duration=r["duration"],
                hours=r["hours"],
                completed=is_comp,
                url=r["url"],
                repo_name=r.get("repo_name"),
                description=r.get("description")
            ))
        
        all_done = all(res.completed for res in resources)
        some_done = any(res.completed for res in resources)
        status = "done" if all_done else ("current" if some_done or s["num"] == "02" else "pending")
        
        steps.append(RoadmapStep(
            num=s["num"],
            title=s["title"],
            duration=s["duration"],
            status=status,
            resources=resources
        ))

    return RoadmapPathway(
        id=matched["id"],
        title=matched["title"],
        target_role=matched["target_role"],
        description=matched["description"],
        github_source=matched["github_source"],
        github_url=matched["github_url"],
        est_weeks=matched["est_weeks"],
        skill_gaps=matched["skill_gaps"],
        steps=steps
    )


def toggle_resource_progress(user_id: int, pathway_id: str, resource_id: str, completed: bool):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    row = cursor.execute("SELECT completed_resources FROM user_roadmaps WHERE user_id = ? AND pathway_id = ?",
                         (user_id, pathway_id)).fetchone()
    
    current = set()
    if row and row[0]:
        try:
            current = set(json.loads(row[0]))
        except Exception:
            pass
    
    if completed:
        current.add(resource_id)
    else:
        current.discard(resource_id)

    cursor.execute("""
        INSERT INTO user_roadmaps (user_id, pathway_id, completed_resources, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, pathway_id) DO UPDATE SET
            completed_resources = excluded.completed_resources,
            updated_at = CURRENT_TIMESTAMP
    """, (user_id, pathway_id, json.dumps(list(current))))
    conn.commit()
    conn.close()
