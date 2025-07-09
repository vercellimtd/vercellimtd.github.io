---
title: Inventory
layout: default
permalink: /inventory
---

{% assign Inventory = site.data.MTDVInventario %}

<ul>
  {% for item in Inventory %}
    <li>
      <strong>{{ item.Title }}</strong><br>
      <em>Identifier:</em> {{ item.Identifier }}<br>
      <em>Type:</em> {{ item.Type }}<br>
      <em>Collection:</em> {{ item.Collection }}<br>
      <em>Relation:</em> {{ item.Relation }}<br>
      <em>Record No:</em> {{ item.RecordNo }}<br>
      <em>Stored In:</em> {{ item.StoredIn }} ({{ item.StoredInDisplay }})<br>
      <em>Creator:</em> {{ item.Creator }}{% if item.Author %}, {{ item.Author }}{% endif %}<br>
      <em>Location:</em> {{ item.Location }}<br>
      <em>Date:</em> {{ item.DateStart }}{% if item.DateEnd %} – {{ item.DateEnd }}{% endif %}<br>
      <em>Temporal:</em> {{ item.Temporal }}<br>
      <em>Description:</em> {{ item.Description }}<br>
      <em>Revision Required:</em> {{ item.RevisionRequired }}<br>
      <em>Format:</em> {{ item.Format }}<br>
      <em>CEIOA:</em> {{ item.CEIOA }}<br>
      <em>MiBACT1998:</em> {{ item.MiBACT1998 }}<br>
      <em>Rights:</em> {{ item.Rights }}
    </li>
  {% endfor %}
</ul>
