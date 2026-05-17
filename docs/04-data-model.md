# 04 — Veri Modeli

## İlişki Özeti

```
companies ──┬──< subscriptions
            ├──< users
            ├──< schools ──< school_assignments >── users
            │              └─< school_product_assignments >── products
            ├──< products ──< questions
            └──< feedbacks ──< feedback_answers
```

## Tablolar

### companies
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | |
| company_name | varchar(255) | |
| plan_type | enum | starter / professional / enterprise |
| max_users | int | Plan limiti |
| max_schools | int | -1 = sınırsız |
| max_feedbacks_monthly | int | -1 = sınırsız |
| subscription_status | enum | active / trialing / cancelled / past_due |

### subscriptions
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | |
| company_id | uuid FK | |
| lemon_subscription_id | varchar | Lemon Squeezy ID |
| lemon_customer_id | varchar | |
| plan_type | enum | |
| status | varchar | Lemon Squeezy raw status |
| current_period_start / end | timestamptz | |

### users
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | = auth.users.id |
| company_id | uuid FK | |
| email | varchar | |
| full_name | varchar | |
| role | enum | admin / sales |
| is_active | bool | |

### schools
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | |
| company_id | uuid FK | |
| school_name | varchar(255) | |
| city / district | varchar | |
| address / phone / contact_person | — | |
| is_active | bool | |

### school_assignments _(okul ↔ satışçı)_
`school_id` + `user_id` — UNIQUE

### products
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | |
| company_id | uuid FK | |
| product_name | varchar(255) | |
| is_active | bool | |

### school_product_assignments _(okul ↔ ürün)_
`school_id` + `product_id` — UNIQUE

### questions
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | |
| product_id | uuid FK | |
| question_text | text | |
| order_index | int | Gösterim sırası |
| is_required / is_active | bool | |

### feedbacks
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | |
| company_id / school_id / product_id / user_id | uuid FK | |
| status | enum | draft / completed |
| visit_date | date | |

### feedback_answers
| Kolon | Tip | Notlar |
|-------|-----|--------|
| id | uuid PK | |
| feedback_id | uuid FK | |
| question_id | uuid FK | |
| answer_text | text | STT çıktısı veya manuel; **ses dosyası saklanmaz** |
| is_skipped | bool | Pass geçildi mi |

## Enum Tipleri

```sql
plan_type:           starter | professional | enterprise
subscription_status: active | trialing | cancelled | past_due | paused
user_role:           admin | sales
feedback_status:     draft | completed
```
